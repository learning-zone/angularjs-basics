/**
 * @fileoverview added by tsickle
 * Generated from: packages/upgrade/src/dynamic/src/upgrade_adapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Compiler, Injector, isDevMode, NgModule, NgZone, resolveForwardRef, Testability } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrap, element as angularElement, module_ as angularModule } from '../../common/src/angular1';
import { $$TESTABILITY, $COMPILE, $INJECTOR, $ROOT_SCOPE, COMPILER_KEY, INJECTOR_KEY, LAZY_MODULE_REF, NG_ZONE_KEY, UPGRADE_APP_TYPE_KEY } from '../../common/src/constants';
import { downgradeComponent } from '../../common/src/downgrade_component';
import { downgradeInjectable } from '../../common/src/downgrade_injectable';
import { controllerKey, Deferred, onError } from '../../common/src/util';
import { UpgradeNg1ComponentAdapterBuilder } from './upgrade_ng1_adapter';
/** @type {?} */
let upgradeCount = 0;
/**
 * Use `UpgradeAdapter` to allow AngularJS and Angular to coexist in a single application.
 *
 * The `UpgradeAdapter` allows:
 * 1. creation of Angular component from AngularJS component directive
 *    (See [UpgradeAdapter#upgradeNg1Component()])
 * 2. creation of AngularJS directive from Angular component.
 *    (See [UpgradeAdapter#downgradeNg2Component()])
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 * \@usageNotes
 * ### Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. AngularJS directives always execute inside AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be upgraded to an Angular component. This creates an
 *    Angular directive, which bootstraps the AngularJS component directive in that location.
 * 6. An Angular component can be downgraded to an AngularJS component directive. This creates
 *    an AngularJS directive, which bootstraps the Angular component in that location.
 * 7. Whenever an adapter component is instantiated the host element is owned by the framework
 *    doing the instantiation. The other framework then instantiates and owns the view for that
 *    component. This implies that component bindings will always follow the semantics of the
 *    instantiation framework. The syntax is always that of Angular syntax.
 * 8. AngularJS is always bootstrapped first and owns the bottom most view.
 * 9. The new application is running in Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 * ### Example
 *
 * ```
 * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module), myCompilerOptions);
 * const module = angular.module('myExample', []);
 * module.directive('ng2Comp', adapter.downgradeNg2Component(Ng2Component));
 *
 * module.directive('ng1Hello', function() {
 *   return {
 *      scope: { title: '=' },
 *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
 *   };
 * });
 *
 *
 * \@Component({
 *   selector: 'ng2-comp',
 *   inputs: ['name'],
 *   template: 'ng2[<ng1-hello [title]="name">transclude</ng1-hello>](<ng-content></ng-content>)',
 *   directives:
 * })
 * class Ng2Component {
 * }
 *
 * \@NgModule({
 *   declarations: [Ng2Component, adapter.upgradeNg1Component('ng1Hello')],
 *   imports: [BrowserModule]
 * })
 * class MyNg2Module {}
 *
 *
 * document.body.innerHTML = '<ng2-comp name="World">project</ng2-comp>';
 *
 * adapter.bootstrap(document.body, ['myExample']).ready(function() {
 *   expect(document.body.textContent).toEqual(
 *       "ng2[ng1[Hello World!](transclude)](project)");
 * });
 *
 * ```
 *
 * @deprecated Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 * \@publicApi
 */
export class UpgradeAdapter {
    /**
     * @param {?} ng2AppModule
     * @param {?=} compilerOptions
     */
    constructor(ng2AppModule, compilerOptions) {
        this.ng2AppModule = ng2AppModule;
        this.compilerOptions = compilerOptions;
        this.idPrefix = `NG2_UPGRADE_${upgradeCount++}_`;
        this.downgradedComponents = [];
        /**
         * An internal map of ng1 components which need to up upgraded to ng2.
         *
         * We can't upgrade until injector is instantiated and we can retrieve the component metadata.
         * For this reason we keep a list of components to upgrade until ng1 injector is bootstrapped.
         *
         * \@internal
         */
        this.ng1ComponentsToBeUpgraded = {};
        this.upgradedProviders = [];
        this.moduleRef = null;
        if (!ng2AppModule) {
            throw new Error('UpgradeAdapter cannot be instantiated without an NgModule of the Angular app.');
        }
    }
    /**
     * Allows Angular Component to be used from AngularJS.
     *
     * Use `downgradeNg2Component` to create an AngularJS Directive Definition Factory from
     * Angular Component. The adapter will bootstrap Angular component from within the
     * AngularJS template.
     *
     * \@usageNotes
     * ### Mental Model
     *
     * 1. The component is instantiated by being listed in AngularJS template. This means that the
     *    host element is controlled by AngularJS, but the component's view will be controlled by
     *    Angular.
     * 2. Even thought the component is instantiated in AngularJS, it will be using Angular
     *    syntax. This has to be done, this way because we must follow Angular components do not
     *    declare how the attributes should be interpreted.
     * 3. `ng-model` is controlled by AngularJS and communicates with the downgraded Angular component
     *    by way of the `ControlValueAccessor` interface from \@angular/forms. Only components that
     *    implement this interface are eligible.
     *
     * ### Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     *   - ng-model: `<comp ng-model="name">`
     * - Content projection: yes
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     * module.directive('greet', adapter.downgradeNg2Component(Greeter));
     *
     * \@Component({
     *   selector: 'greet',
     *   template: '{{salutation}} {{name}}! - <ng-content></ng-content>'
     * })
     * class Greeter {
     * \@Input() salutation: string; / name: string;
     * }
     *
     * \@NgModule({
     *   declarations: [Greeter],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML =
     *   'ng1 template: <greet salutation="Hello" [name]="world">text</greet>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng1 template: Hello world! - text");
     * });
     * ```
     * @param {?} component
     * @return {?}
     */
    downgradeNg2Component(component) {
        this.downgradedComponents.push(component);
        return downgradeComponent({ component });
    }
    /**
     * Allows AngularJS Component to be used from Angular.
     *
     * Use `upgradeNg1Component` to create an Angular component from AngularJS Component
     * directive. The adapter will bootstrap AngularJS component from within the Angular
     * template.
     *
     * \@usageNotes
     * ### Mental Model
     *
     * 1. The component is instantiated by being listed in Angular template. This means that the
     *    host element is controlled by Angular, but the component's view will be controlled by
     *    AngularJS.
     *
     * ### Supported Features
     *
     * - Bindings:
     *   - Attribute: `<comp name="World">`
     *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
     *   - Expression:  `<comp [name]="username">`
     *   - Event:  `<comp (close)="doSomething()">`
     * - Transclusion: yes
     * - Only some of the features of
     *   [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
     *   supported:
     *   - `compile`: not supported because the host element is owned by Angular, which does
     *     not allow modifying DOM structure during compilation.
     *   - `controller`: supported. (NOTE: injection of `$attrs` and `$transclude` is not supported.)
     *   - `controllerAs`: supported.
     *   - `bindToController`: supported.
     *   - `link`: supported. (NOTE: only pre-link function is supported.)
     *   - `name`: supported.
     *   - `priority`: ignored.
     *   - `replace`: not supported.
     *   - `require`: supported.
     *   - `restrict`: must be set to 'E'.
     *   - `scope`: supported.
     *   - `template`: supported.
     *   - `templateUrl`: supported.
     *   - `terminal`: ignored.
     *   - `transclude`: supported.
     *
     *
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
     * const module = angular.module('myExample', []);
     *
     * module.directive('greet', function() {
     *   return {
     *     scope: {salutation: '=', name: '=' },
     *     template: '{{salutation}} {{name}}! - <span ng-transclude></span>'
     *   };
     * });
     *
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
     *
     * \@Component({
     *   selector: 'ng2',
     *   template: 'ng2 template: <greet salutation="Hello" [name]="world">text</greet>'
     * })
     * class Ng2Component {
     * }
     *
     * \@NgModule({
     *   declarations: [Ng2Component, adapter.upgradeNg1Component('greet')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2></ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual("ng2 template: Hello world! - text");
     * });
     * ```
     * @param {?} name
     * @return {?}
     */
    upgradeNg1Component(name) {
        if (((/** @type {?} */ (this.ng1ComponentsToBeUpgraded))).hasOwnProperty(name)) {
            return this.ng1ComponentsToBeUpgraded[name].type;
        }
        else {
            return (this.ng1ComponentsToBeUpgraded[name] = new UpgradeNg1ComponentAdapterBuilder(name))
                .type;
        }
    }
    /**
     * Registers the adapter's AngularJS upgrade module for unit testing in AngularJS.
     * Use this instead of `angular.mock.module()` to load the upgrade module into
     * the AngularJS testing injector.
     *
     * \@usageNotes
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     *
     * // configure the adapter with upgrade/downgrade components and services
     * upgradeAdapter.downgradeNg2Component(MyComponent);
     *
     * let upgradeAdapterRef: UpgradeAdapterRef;
     * let $compile, $rootScope;
     *
     * // We must register the adapter before any calls to `inject()`
     * beforeEach(() => {
     *   upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['heroApp']);
     * });
     *
     * beforeEach(inject((_$compile_, _$rootScope_) => {
     *   $compile = _$compile_;
     *   $rootScope = _$rootScope_;
     * }));
     *
     * it("says hello", (done) => {
     *   upgradeAdapterRef.ready(() => {
     *     const element = $compile("<my-component></my-component>")($rootScope);
     *     $rootScope.$apply();
     *     expect(element.html()).toContain("Hello World");
     *     done();
     *   })
     * });
     *
     * ```
     *
     * @param {?=} modules any AngularJS modules that the upgrade module should depend upon
     * @return {?} an `UpgradeAdapterRef`, which lets you register a `ready()` callback to
     * run assertions once the Angular components are ready to test through AngularJS.
     */
    registerForNg1Tests(modules) {
        /** @type {?} */
        const windowNgMock = ((/** @type {?} */ (window)))['angular'].mock;
        if (!windowNgMock || !windowNgMock.module) {
            throw new Error('Failed to find \'angular.mock.module\'.');
        }
        this.declareNg1Module(modules);
        windowNgMock.module(this.ng1Module.name);
        /** @type {?} */
        const upgrade = new UpgradeAdapterRef();
        this.ng2BootstrapDeferred.promise.then((/**
         * @param {?} ng1Injector
         * @return {?}
         */
        (ng1Injector) => {
            ((/** @type {?} */ (upgrade)))._bootstrapDone(this.moduleRef, ng1Injector);
        }), onError);
        return upgrade;
    }
    /**
     * Bootstrap a hybrid AngularJS / Angular application.
     *
     * This `bootstrap` method is a direct replacement (takes same arguments) for AngularJS
     * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
     * AngularJS, this bootstrap is asynchronous.
     *
     * \@usageNotes
     * ### Example
     *
     * ```
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * const module = angular.module('myExample', []);
     * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
     *
     * module.directive('ng1', function() {
     *   return {
     *      scope: { title: '=' },
     *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
     *   };
     * });
     *
     *
     * \@Component({
     *   selector: 'ng2',
     *   inputs: ['name'],
     *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
     * })
     * class Ng2 {
     * }
     *
     * \@NgModule({
     *   declarations: [Ng2, adapter.upgradeNg1Component('ng1')],
     *   imports: [BrowserModule]
     * })
     * class MyNg2Module {}
     *
     * document.body.innerHTML = '<ng2 name="World">project</ng2>';
     *
     * adapter.bootstrap(document.body, ['myExample']).ready(function() {
     *   expect(document.body.textContent).toEqual(
     *       "ng2[ng1[Hello World!](transclude)](project)");
     * });
     * ```
     * @param {?} element
     * @param {?=} modules
     * @param {?=} config
     * @return {?}
     */
    bootstrap(element, modules, config) {
        this.declareNg1Module(modules);
        /** @type {?} */
        const upgrade = new UpgradeAdapterRef();
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        /** @type {?} */
        const windowAngular = ((/** @type {?} */ (window)))['angular'];
        windowAngular.resumeBootstrap = undefined;
        this.ngZone.run((/**
         * @return {?}
         */
        () => {
            bootstrap(element, [this.ng1Module.name], (/** @type {?} */ (config)));
        }));
        /** @type {?} */
        const ng1BootstrapPromise = new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        (resolve) => {
            if (windowAngular.resumeBootstrap) {
                /** @type {?} */
                const originalResumeBootstrap = windowAngular.resumeBootstrap;
                windowAngular.resumeBootstrap = (/**
                 * @return {?}
                 */
                function () {
                    windowAngular.resumeBootstrap = originalResumeBootstrap;
                    /** @type {?} */
                    const r = windowAngular.resumeBootstrap.apply(this, arguments);
                    resolve();
                    return r;
                });
            }
            else {
                resolve();
            }
        }));
        Promise.all([this.ng2BootstrapDeferred.promise, ng1BootstrapPromise]).then((/**
         * @param {?} __0
         * @return {?}
         */
        ([ng1Injector]) => {
            (/** @type {?} */ (angularElement(element).data))(controllerKey(INJECTOR_KEY), (/** @type {?} */ (this.moduleRef)).injector);
            (/** @type {?} */ (this.moduleRef)).injector.get(NgZone).run((/**
             * @return {?}
             */
            () => {
                ((/** @type {?} */ (upgrade)))._bootstrapDone(this.moduleRef, ng1Injector);
            }));
        }), onError);
        return upgrade;
    }
    /**
     * Allows AngularJS service to be accessible from Angular.
     *
     * \@usageNotes
     * ### Example
     *
     * ```
     * class Login { ... }
     * class Server { ... }
     *
     * \@Injectable()
     * class Example {
     *   constructor(\@Inject('server') server, login: Login) {
     *     ...
     *   }
     * }
     *
     * const module = angular.module('myExample', []);
     * module.service('server', Server);
     * module.service('login', Login);
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     * adapter.upgradeNg1Provider('server');
     * adapter.upgradeNg1Provider('login', {asToken: Login});
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng2Injector.get(Example);
     * });
     *
     * ```
     * @param {?} name
     * @param {?=} options
     * @return {?}
     */
    upgradeNg1Provider(name, options) {
        /** @type {?} */
        const token = options && options.asToken || name;
        this.upgradedProviders.push({
            provide: token,
            useFactory: (/**
             * @param {?} $injector
             * @return {?}
             */
            ($injector) => $injector.get(name)),
            deps: [$INJECTOR]
        });
    }
    /**
     * Allows Angular service to be accessible from AngularJS.
     *
     * \@usageNotes
     * ### Example
     *
     * ```
     * class Example {
     * }
     *
     * const adapter = new UpgradeAdapter(MyNg2Module);
     *
     * const module = angular.module('myExample', []);
     * module.factory('example', adapter.downgradeNg2Provider(Example));
     *
     * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
     *   const example: Example = ref.ng1Injector.get('example');
     * });
     *
     * ```
     * @param {?} token
     * @return {?}
     */
    downgradeNg2Provider(token) {
        return downgradeInjectable(token);
    }
    /**
     * Declare the AngularJS upgrade module for this adapter without bootstrapping the whole
     * hybrid application.
     *
     * This method is automatically called by `bootstrap()` and `registerForNg1Tests()`.
     *
     * \@usageNotes
     * ### Example
     *
     * ```
     * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
     * upgradeAdapter.declareNg1Module(['heroApp']);
     * ```
     * @private
     * @param {?=} modules The AngularJS modules that this upgrade module should depend upon.
     * @return {?} The AngularJS upgrade module that is declared by this method
     *
     */
    declareNg1Module(modules = []) {
        /** @type {?} */
        const delayApplyExps = [];
        /** @type {?} */
        let original$applyFn;
        /** @type {?} */
        let rootScopePrototype;
        /** @type {?} */
        let rootScope;
        /** @type {?} */
        const upgradeAdapter = this;
        /** @type {?} */
        const ng1Module = this.ng1Module = angularModule(this.idPrefix, modules);
        /** @type {?} */
        const platformRef = platformBrowserDynamic();
        this.ngZone = new NgZone({ enableLongStackTrace: Zone.hasOwnProperty('longStackTraceZoneSpec') });
        this.ng2BootstrapDeferred = new Deferred();
        ng1Module.constant(UPGRADE_APP_TYPE_KEY, 1 /* Dynamic */)
            .factory(INJECTOR_KEY, (/**
         * @return {?}
         */
        () => (/** @type {?} */ (this.moduleRef)).injector.get(Injector)))
            .factory(LAZY_MODULE_REF, [INJECTOR_KEY, (/**
             * @param {?} injector
             * @return {?}
             */
            (injector) => ((/** @type {?} */ ({ injector }))))])
            .constant(NG_ZONE_KEY, this.ngZone)
            .factory(COMPILER_KEY, (/**
         * @return {?}
         */
        () => (/** @type {?} */ (this.moduleRef)).injector.get(Compiler)))
            .config([
            '$provide', '$injector',
            (/**
             * @param {?} provide
             * @param {?} ng1Injector
             * @return {?}
             */
            (provide, ng1Injector) => {
                provide.decorator($ROOT_SCOPE, [
                    '$delegate',
                    (/**
                     * @param {?} rootScopeDelegate
                     * @return {?}
                     */
                    function (rootScopeDelegate) {
                        // Capture the root apply so that we can delay first call to $apply until we
                        // bootstrap Angular and then we replay and restore the $apply.
                        rootScopePrototype = rootScopeDelegate.constructor.prototype;
                        if (rootScopePrototype.hasOwnProperty('$apply')) {
                            original$applyFn = rootScopePrototype.$apply;
                            rootScopePrototype.$apply = (/**
                             * @param {?} exp
                             * @return {?}
                             */
                            (exp) => delayApplyExps.push(exp));
                        }
                        else {
                            throw new Error('Failed to find \'$apply\' on \'$rootScope\'!');
                        }
                        return rootScope = rootScopeDelegate;
                    })
                ]);
                if (ng1Injector.has($$TESTABILITY)) {
                    provide.decorator($$TESTABILITY, [
                        '$delegate',
                        (/**
                         * @param {?} testabilityDelegate
                         * @return {?}
                         */
                        function (testabilityDelegate) {
                            /** @type {?} */
                            const originalWhenStable = testabilityDelegate.whenStable;
                            // Cannot use arrow function below because we need the context
                            /** @type {?} */
                            const newWhenStable = (/**
                             * @this {?}
                             * @param {?} callback
                             * @return {?}
                             */
                            function (callback) {
                                originalWhenStable.call(this, (/**
                                 * @this {?}
                                 * @return {?}
                                 */
                                function () {
                                    /** @type {?} */
                                    const ng2Testability = (/** @type {?} */ (upgradeAdapter.moduleRef)).injector.get(Testability);
                                    if (ng2Testability.isStable()) {
                                        callback.apply(this, arguments);
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(this, callback));
                                    }
                                }));
                            });
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        })
                    ]);
                }
            })
        ]);
        ng1Module.run([
            '$injector', '$rootScope',
            (/**
             * @param {?} ng1Injector
             * @param {?} rootScope
             * @return {?}
             */
            (ng1Injector, rootScope) => {
                UpgradeNg1ComponentAdapterBuilder.resolve(this.ng1ComponentsToBeUpgraded, ng1Injector)
                    .then((/**
                 * @return {?}
                 */
                () => {
                    // Note: There is a bug in TS 2.4 that prevents us from
                    // inlining this into @NgModule
                    // TODO(tbosch): find or file a bug against TypeScript for this.
                    /** @type {?} */
                    const ngModule = {
                        providers: [
                            { provide: $INJECTOR, useFactory: (/**
                                 * @return {?}
                                 */
                                () => ng1Injector) },
                            { provide: $COMPILE, useFactory: (/**
                                 * @return {?}
                                 */
                                () => ng1Injector.get($COMPILE)) },
                            this.upgradedProviders
                        ],
                        imports: [resolveForwardRef(this.ng2AppModule)],
                        entryComponents: this.downgradedComponents
                    };
                    // At this point we have ng1 injector and we have prepared
                    // ng1 components to be upgraded, we now can bootstrap ng2.
                    class DynamicNgUpgradeModule {
                        constructor() { }
                        /**
                         * @return {?}
                         */
                        ngDoBootstrap() { }
                    }
                    DynamicNgUpgradeModule.decorators = [
                        { type: NgModule, args: [Object.assign({ jit: true }, ngModule),] },
                    ];
                    /** @nocollapse */
                    DynamicNgUpgradeModule.ctorParameters = () => [];
                    platformRef
                        .bootstrapModule(DynamicNgUpgradeModule, [(/** @type {?} */ (this.compilerOptions)), { ngZone: this.ngZone }])
                        .then((/**
                     * @param {?} ref
                     * @return {?}
                     */
                    (ref) => {
                        this.moduleRef = ref;
                        this.ngZone.run((/**
                         * @return {?}
                         */
                        () => {
                            if (rootScopePrototype) {
                                rootScopePrototype.$apply = original$applyFn; // restore original $apply
                                while (delayApplyExps.length) {
                                    rootScope.$apply(delayApplyExps.shift());
                                }
                                rootScopePrototype = null;
                            }
                        }));
                    }))
                        .then((/**
                     * @return {?}
                     */
                    () => this.ng2BootstrapDeferred.resolve(ng1Injector)), onError)
                        .then((/**
                     * @return {?}
                     */
                    () => {
                        /** @type {?} */
                        let subscription = this.ngZone.onMicrotaskEmpty.subscribe({
                            next: (/**
                             * @return {?}
                             */
                            () => {
                                if (rootScope.$$phase) {
                                    if (isDevMode()) {
                                        console.warn('A digest was triggered while one was already in progress. This may mean that something is triggering digests outside the Angular zone.');
                                    }
                                    return rootScope.$evalAsync((/**
                                     * @return {?}
                                     */
                                    () => { }));
                                }
                                return rootScope.$digest();
                            })
                        });
                        rootScope.$on('$destroy', (/**
                         * @return {?}
                         */
                        () => {
                            subscription.unsubscribe();
                        }));
                    }));
                }))
                    .catch((/**
                 * @param {?} e
                 * @return {?}
                 */
                (e) => this.ng2BootstrapDeferred.reject(e)));
            })
        ]);
        return ng1Module;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.idPrefix;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.downgradedComponents;
    /**
     * An internal map of ng1 components which need to up upgraded to ng2.
     *
     * We can't upgrade until injector is instantiated and we can retrieve the component metadata.
     * For this reason we keep a list of components to upgrade until ng1 injector is bootstrapped.
     *
     * \@internal
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.ng1ComponentsToBeUpgraded;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.upgradedProviders;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.ng1Module;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.moduleRef;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.ng2BootstrapDeferred;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.ng2AppModule;
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapter.prototype.compilerOptions;
}
/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of AngularJS's $compile.
 */
class ParentInjectorPromise {
    /**
     * @param {?} element
     */
    constructor(element) {
        this.element = element;
        this.callbacks = [];
        // store the promise on the element
        (/** @type {?} */ (element.data))(controllerKey(INJECTOR_KEY), this);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    then(callback) {
        if (this.injector) {
            callback(this.injector);
        }
        else {
            this.callbacks.push(callback);
        }
    }
    /**
     * @param {?} injector
     * @return {?}
     */
    resolve(injector) {
        this.injector = injector;
        // reset the element data to point to the real injector
        (/** @type {?} */ (this.element.data))(controllerKey(INJECTOR_KEY), injector);
        // clean out the element to prevent memory leaks
        this.element = (/** @type {?} */ (null));
        // run all the queued callbacks
        this.callbacks.forEach((/**
         * @param {?} callback
         * @return {?}
         */
        (callback) => callback(injector)));
        this.callbacks.length = 0;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    ParentInjectorPromise.prototype.injector;
    /**
     * @type {?}
     * @private
     */
    ParentInjectorPromise.prototype.callbacks;
    /**
     * @type {?}
     * @private
     */
    ParentInjectorPromise.prototype.element;
}
/**
 * Use `UpgradeAdapterRef` to control a hybrid AngularJS / Angular application.
 *
 * @deprecated Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 * \@publicApi
 */
export class UpgradeAdapterRef {
    constructor() {
        /* @internal */
        this._readyFn = null;
        this.ng1RootScope = (/** @type {?} */ (null));
        this.ng1Injector = (/** @type {?} */ (null));
        this.ng2ModuleRef = (/** @type {?} */ (null));
        this.ng2Injector = (/** @type {?} */ (null));
    }
    /* @internal */
    /**
     * @private
     * @param {?} ngModuleRef
     * @param {?} ng1Injector
     * @return {?}
     */
    _bootstrapDone(ngModuleRef, ng1Injector) {
        this.ng2ModuleRef = ngModuleRef;
        this.ng2Injector = ngModuleRef.injector;
        this.ng1Injector = ng1Injector;
        this.ng1RootScope = ng1Injector.get($ROOT_SCOPE);
        this._readyFn && this._readyFn(this);
    }
    /**
     * Register a callback function which is notified upon successful hybrid AngularJS / Angular
     * application has been bootstrapped.
     *
     * The `ready` callback function is invoked inside the Angular zone, therefore it does not
     * require a call to `$apply()`.
     * @param {?} fn
     * @return {?}
     */
    ready(fn) {
        this._readyFn = fn;
    }
    /**
     * Dispose of running hybrid AngularJS / Angular application.
     * @return {?}
     */
    dispose() {
        (/** @type {?} */ (this.ng1Injector)).get($ROOT_SCOPE).$destroy();
        (/** @type {?} */ (this.ng2ModuleRef)).destroy();
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    UpgradeAdapterRef.prototype._readyFn;
    /** @type {?} */
    UpgradeAdapterRef.prototype.ng1RootScope;
    /** @type {?} */
    UpgradeAdapterRef.prototype.ng1Injector;
    /** @type {?} */
    UpgradeAdapterRef.prototype.ng2ModuleRef;
    /** @type {?} */
    UpgradeAdapterRef.prototype.ng2Injector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zcmMvZHluYW1pYy9zcmMvdXBncmFkZV9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQW1CLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFlLE1BQU0sRUFBRSxpQkFBaUIsRUFBa0IsV0FBVyxFQUFPLE1BQU0sZUFBZSxDQUFDO0FBQ2xLLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBRXpFLE9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxJQUFJLGNBQWMsRUFBaUksT0FBTyxJQUFJLGFBQWEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3hPLE9BQU8sRUFBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDM0ssT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDMUUsT0FBTyxFQUFDLGFBQWEsRUFBRSxRQUFRLEVBQWlCLE9BQU8sRUFBaUIsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RyxPQUFPLEVBQUMsaUNBQWlDLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7SUFFcEUsWUFBWSxHQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0Y1QixNQUFNLE9BQU8sY0FBYzs7Ozs7SUFxQnpCLFlBQW9CLFlBQXVCLEVBQVUsZUFBaUM7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USxHQUEwRCxJQUFJLENBQUM7UUFFeEUsaUJBQVksR0FBc0IsbUJBQUEsSUFBSSxFQUFDLENBQUM7UUFDeEMsZ0JBQVcsR0FBcUIsbUJBQUEsSUFBSSxFQUFDLENBQUM7UUFDdEMsaUJBQVksR0FBcUIsbUJBQUEsSUFBSSxFQUFDLENBQUM7UUFDdkMsZ0JBQVcsR0FBYSxtQkFBQSxJQUFJLEVBQUMsQ0FBQztJQTZCdkMsQ0FBQzs7Ozs7Ozs7SUExQlMsY0FBYyxDQUFDLFdBQTZCLEVBQUUsV0FBNkI7UUFDakYsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7Ozs7OztJQVNNLEtBQUssQ0FBQyxFQUFrRDtRQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDOzs7OztJQUtNLE9BQU87UUFDWixtQkFBQSxJQUFJLENBQUMsV0FBVyxFQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlDLG1CQUFBLElBQUksQ0FBQyxZQUFZLEVBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQixDQUFDO0NBQ0Y7Ozs7OztJQWxDQyxxQ0FBK0U7O0lBRS9FLHlDQUErQzs7SUFDL0Msd0NBQTZDOztJQUM3Qyx5Q0FBOEM7O0lBQzlDLHdDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21waWxlciwgQ29tcGlsZXJPcHRpb25zLCBJbmplY3RvciwgaXNEZXZNb2RlLCBOZ01vZHVsZSwgTmdNb2R1bGVSZWYsIE5nWm9uZSwgcmVzb2x2ZUZvcndhcmRSZWYsIFN0YXRpY1Byb3ZpZGVyLCBUZXN0YWJpbGl0eSwgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3BsYXRmb3JtQnJvd3NlckR5bmFtaWN9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYyc7XG5cbmltcG9ydCB7Ym9vdHN0cmFwLCBlbGVtZW50IGFzIGFuZ3VsYXJFbGVtZW50LCBJQW5ndWxhckJvb3RzdHJhcENvbmZpZywgSUF1Z21lbnRlZEpRdWVyeSwgSUluamVjdG9yU2VydmljZSwgSU1vZHVsZSwgSVByb3ZpZGVTZXJ2aWNlLCBJUm9vdFNjb3BlU2VydmljZSwgSVRlc3RhYmlsaXR5U2VydmljZSwgbW9kdWxlXyBhcyBhbmd1bGFyTW9kdWxlfSBmcm9tICcuLi8uLi9jb21tb24vc3JjL2FuZ3VsYXIxJztcbmltcG9ydCB7JCRURVNUQUJJTElUWSwgJENPTVBJTEUsICRJTkpFQ1RPUiwgJFJPT1RfU0NPUEUsIENPTVBJTEVSX0tFWSwgSU5KRUNUT1JfS0VZLCBMQVpZX01PRFVMRV9SRUYsIE5HX1pPTkVfS0VZLCBVUEdSQURFX0FQUF9UWVBFX0tFWX0gZnJvbSAnLi4vLi4vY29tbW9uL3NyYy9jb25zdGFudHMnO1xuaW1wb3J0IHtkb3duZ3JhZGVDb21wb25lbnR9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvZG93bmdyYWRlX2NvbXBvbmVudCc7XG5pbXBvcnQge2Rvd25ncmFkZUluamVjdGFibGV9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvZG93bmdyYWRlX2luamVjdGFibGUnO1xuaW1wb3J0IHtjb250cm9sbGVyS2V5LCBEZWZlcnJlZCwgTGF6eU1vZHVsZVJlZiwgb25FcnJvciwgVXBncmFkZUFwcFR5cGV9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvdXRpbCc7XG5cbmltcG9ydCB7VXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXJCdWlsZGVyfSBmcm9tICcuL3VwZ3JhZGVfbmcxX2FkYXB0ZXInO1xuXG5sZXQgdXBncmFkZUNvdW50OiBudW1iZXIgPSAwO1xuXG4vKipcbiAqIFVzZSBgVXBncmFkZUFkYXB0ZXJgIHRvIGFsbG93IEFuZ3VsYXJKUyBhbmQgQW5ndWxhciB0byBjb2V4aXN0IGluIGEgc2luZ2xlIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoZSBgVXBncmFkZUFkYXB0ZXJgIGFsbG93czpcbiAqIDEuIGNyZWF0aW9uIG9mIEFuZ3VsYXIgY29tcG9uZW50IGZyb20gQW5ndWxhckpTIGNvbXBvbmVudCBkaXJlY3RpdmVcbiAqICAgIChTZWUgW1VwZ3JhZGVBZGFwdGVyI3VwZ3JhZGVOZzFDb21wb25lbnQoKV0pXG4gKiAyLiBjcmVhdGlvbiBvZiBBbmd1bGFySlMgZGlyZWN0aXZlIGZyb20gQW5ndWxhciBjb21wb25lbnQuXG4gKiAgICAoU2VlIFtVcGdyYWRlQWRhcHRlciNkb3duZ3JhZGVOZzJDb21wb25lbnQoKV0pXG4gKiAzLiBCb290c3RyYXBwaW5nIG9mIGEgaHlicmlkIEFuZ3VsYXIgYXBwbGljYXRpb24gd2hpY2ggY29udGFpbnMgYm90aCBvZiB0aGUgZnJhbWV3b3Jrc1xuICogICAgY29leGlzdGluZyBpbiBhIHNpbmdsZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIE1lbnRhbCBNb2RlbFxuICpcbiAqIFdoZW4gcmVhc29uaW5nIGFib3V0IGhvdyBhIGh5YnJpZCBhcHBsaWNhdGlvbiB3b3JrcyBpdCBpcyB1c2VmdWwgdG8gaGF2ZSBhIG1lbnRhbCBtb2RlbCB3aGljaFxuICogZGVzY3JpYmVzIHdoYXQgaXMgaGFwcGVuaW5nIGFuZCBleHBsYWlucyB3aGF0IGlzIGhhcHBlbmluZyBhdCB0aGUgbG93ZXN0IGxldmVsLlxuICpcbiAqIDEuIFRoZXJlIGFyZSB0d28gaW5kZXBlbmRlbnQgZnJhbWV3b3JrcyBydW5uaW5nIGluIGEgc2luZ2xlIGFwcGxpY2F0aW9uLCBlYWNoIGZyYW1ld29yayB0cmVhdHNcbiAqICAgIHRoZSBvdGhlciBhcyBhIGJsYWNrIGJveC5cbiAqIDIuIEVhY2ggRE9NIGVsZW1lbnQgb24gdGhlIHBhZ2UgaXMgb3duZWQgZXhhY3RseSBieSBvbmUgZnJhbWV3b3JrLiBXaGljaGV2ZXIgZnJhbWV3b3JrXG4gKiAgICBpbnN0YW50aWF0ZWQgdGhlIGVsZW1lbnQgaXMgdGhlIG93bmVyLiBFYWNoIGZyYW1ld29yayBvbmx5IHVwZGF0ZXMvaW50ZXJhY3RzIHdpdGggaXRzIG93blxuICogICAgRE9NIGVsZW1lbnRzIGFuZCBpZ25vcmVzIG90aGVycy5cbiAqIDMuIEFuZ3VsYXJKUyBkaXJlY3RpdmVzIGFsd2F5cyBleGVjdXRlIGluc2lkZSBBbmd1bGFySlMgZnJhbWV3b3JrIGNvZGViYXNlIHJlZ2FyZGxlc3Mgb2ZcbiAqICAgIHdoZXJlIHRoZXkgYXJlIGluc3RhbnRpYXRlZC5cbiAqIDQuIEFuZ3VsYXIgY29tcG9uZW50cyBhbHdheXMgZXhlY3V0ZSBpbnNpZGUgQW5ndWxhciBmcmFtZXdvcmsgY29kZWJhc2UgcmVnYXJkbGVzcyBvZlxuICogICAgd2hlcmUgdGhleSBhcmUgaW5zdGFudGlhdGVkLlxuICogNS4gQW4gQW5ndWxhckpTIGNvbXBvbmVudCBjYW4gYmUgdXBncmFkZWQgdG8gYW4gQW5ndWxhciBjb21wb25lbnQuIFRoaXMgY3JlYXRlcyBhblxuICogICAgQW5ndWxhciBkaXJlY3RpdmUsIHdoaWNoIGJvb3RzdHJhcHMgdGhlIEFuZ3VsYXJKUyBjb21wb25lbnQgZGlyZWN0aXZlIGluIHRoYXQgbG9jYXRpb24uXG4gKiA2LiBBbiBBbmd1bGFyIGNvbXBvbmVudCBjYW4gYmUgZG93bmdyYWRlZCB0byBhbiBBbmd1bGFySlMgY29tcG9uZW50IGRpcmVjdGl2ZS4gVGhpcyBjcmVhdGVzXG4gKiAgICBhbiBBbmd1bGFySlMgZGlyZWN0aXZlLCB3aGljaCBib290c3RyYXBzIHRoZSBBbmd1bGFyIGNvbXBvbmVudCBpbiB0aGF0IGxvY2F0aW9uLlxuICogNy4gV2hlbmV2ZXIgYW4gYWRhcHRlciBjb21wb25lbnQgaXMgaW5zdGFudGlhdGVkIHRoZSBob3N0IGVsZW1lbnQgaXMgb3duZWQgYnkgdGhlIGZyYW1ld29ya1xuICogICAgZG9pbmcgdGhlIGluc3RhbnRpYXRpb24uIFRoZSBvdGhlciBmcmFtZXdvcmsgdGhlbiBpbnN0YW50aWF0ZXMgYW5kIG93bnMgdGhlIHZpZXcgZm9yIHRoYXRcbiAqICAgIGNvbXBvbmVudC4gVGhpcyBpbXBsaWVzIHRoYXQgY29tcG9uZW50IGJpbmRpbmdzIHdpbGwgYWx3YXlzIGZvbGxvdyB0aGUgc2VtYW50aWNzIG9mIHRoZVxuICogICAgaW5zdGFudGlhdGlvbiBmcmFtZXdvcmsuIFRoZSBzeW50YXggaXMgYWx3YXlzIHRoYXQgb2YgQW5ndWxhciBzeW50YXguXG4gKiA4LiBBbmd1bGFySlMgaXMgYWx3YXlzIGJvb3RzdHJhcHBlZCBmaXJzdCBhbmQgb3ducyB0aGUgYm90dG9tIG1vc3Qgdmlldy5cbiAqIDkuIFRoZSBuZXcgYXBwbGljYXRpb24gaXMgcnVubmluZyBpbiBBbmd1bGFyIHpvbmUsIGFuZCB0aGVyZWZvcmUgaXQgbm8gbG9uZ2VyIG5lZWRzIGNhbGxzIHRvXG4gKiAgICBgJGFwcGx5KClgLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiBjb25zdCBhZGFwdGVyID0gbmV3IFVwZ3JhZGVBZGFwdGVyKGZvcndhcmRSZWYoKCkgPT4gTXlOZzJNb2R1bGUpLCBteUNvbXBpbGVyT3B0aW9ucyk7XG4gKiBjb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICogbW9kdWxlLmRpcmVjdGl2ZSgnbmcyQ29tcCcsIGFkYXB0ZXIuZG93bmdyYWRlTmcyQ29tcG9uZW50KE5nMkNvbXBvbmVudCkpO1xuICpcbiAqIG1vZHVsZS5kaXJlY3RpdmUoJ25nMUhlbGxvJywgZnVuY3Rpb24oKSB7XG4gKiAgIHJldHVybiB7XG4gKiAgICAgIHNjb3BlOiB7IHRpdGxlOiAnPScgfSxcbiAqICAgICAgdGVtcGxhdGU6ICduZzFbSGVsbG8ge3t0aXRsZX19IV0oPHNwYW4gbmctdHJhbnNjbHVkZT48L3NwYW4+KSdcbiAqICAgfTtcbiAqIH0pO1xuICpcbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICduZzItY29tcCcsXG4gKiAgIGlucHV0czogWyduYW1lJ10sXG4gKiAgIHRlbXBsYXRlOiAnbmcyWzxuZzEtaGVsbG8gW3RpdGxlXT1cIm5hbWVcIj50cmFuc2NsdWRlPC9uZzEtaGVsbG8+XSg8bmctY29udGVudD48L25nLWNvbnRlbnQ+KScsXG4gKiAgIGRpcmVjdGl2ZXM6XG4gKiB9KVxuICogY2xhc3MgTmcyQ29tcG9uZW50IHtcbiAqIH1cbiAqXG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtOZzJDb21wb25lbnQsIGFkYXB0ZXIudXBncmFkZU5nMUNvbXBvbmVudCgnbmcxSGVsbG8nKV0sXG4gKiAgIGltcG9ydHM6IFtCcm93c2VyTW9kdWxlXVxuICogfSlcbiAqIGNsYXNzIE15TmcyTW9kdWxlIHt9XG4gKlxuICpcbiAqIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJzxuZzItY29tcCBuYW1lPVwiV29ybGRcIj5wcm9qZWN0PC9uZzItY29tcD4nO1xuICpcbiAqIGFkYXB0ZXIuYm9vdHN0cmFwKGRvY3VtZW50LmJvZHksIFsnbXlFeGFtcGxlJ10pLnJlYWR5KGZ1bmN0aW9uKCkge1xuICogICBleHBlY3QoZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCkudG9FcXVhbChcbiAqICAgICAgIFwibmcyW25nMVtIZWxsbyBXb3JsZCFdKHRyYW5zY2x1ZGUpXShwcm9qZWN0KVwiKTtcbiAqIH0pO1xuICpcbiAqIGBgYFxuICpcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgc2luY2UgdjUuIFVzZSBgdXBncmFkZS9zdGF0aWNgIGluc3RlYWQsIHdoaWNoIGFsc28gc3VwcG9ydHNcbiAqIFtBaGVhZC1vZi1UaW1lIGNvbXBpbGF0aW9uXShndWlkZS9hb3QtY29tcGlsZXIpLlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVXBncmFkZUFkYXB0ZXIge1xuICBwcml2YXRlIGlkUHJlZml4OiBzdHJpbmcgPSBgTkcyX1VQR1JBREVfJHt1cGdyYWRlQ291bnQrK31fYDtcbiAgcHJpdmF0ZSBkb3duZ3JhZGVkQ29tcG9uZW50czogVHlwZTxhbnk+W10gPSBbXTtcbiAgLyoqXG4gICAqIEFuIGludGVybmFsIG1hcCBvZiBuZzEgY29tcG9uZW50cyB3aGljaCBuZWVkIHRvIHVwIHVwZ3JhZGVkIHRvIG5nMi5cbiAgICpcbiAgICogV2UgY2FuJ3QgdXBncmFkZSB1bnRpbCBpbmplY3RvciBpcyBpbnN0YW50aWF0ZWQgYW5kIHdlIGNhbiByZXRyaWV2ZSB0aGUgY29tcG9uZW50IG1ldGFkYXRhLlxuICAgKiBGb3IgdGhpcyByZWFzb24gd2Uga2VlcCBhIGxpc3Qgb2YgY29tcG9uZW50cyB0byB1cGdyYWRlIHVudGlsIG5nMSBpbmplY3RvciBpcyBib290c3RyYXBwZWQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBuZzFDb21wb25lbnRzVG9CZVVwZ3JhZGVkOiB7W25hbWU6IHN0cmluZ106IFVwZ3JhZGVOZzFDb21wb25lbnRBZGFwdGVyQnVpbGRlcn0gPSB7fTtcbiAgcHJpdmF0ZSB1cGdyYWRlZFByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtdO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBuZ1pvbmUhOiBOZ1pvbmU7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIG5nMU1vZHVsZSE6IElNb2R1bGU7XG4gIHByaXZhdGUgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+fG51bGwgPSBudWxsO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBuZzJCb290c3RyYXBEZWZlcnJlZCE6IERlZmVycmVkPElJbmplY3RvclNlcnZpY2U+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmcyQXBwTW9kdWxlOiBUeXBlPGFueT4sIHByaXZhdGUgY29tcGlsZXJPcHRpb25zPzogQ29tcGlsZXJPcHRpb25zKSB7XG4gICAgaWYgKCFuZzJBcHBNb2R1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnVXBncmFkZUFkYXB0ZXIgY2Fubm90IGJlIGluc3RhbnRpYXRlZCB3aXRob3V0IGFuIE5nTW9kdWxlIG9mIHRoZSBBbmd1bGFyIGFwcC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIEFuZ3VsYXIgQ29tcG9uZW50IHRvIGJlIHVzZWQgZnJvbSBBbmd1bGFySlMuXG4gICAqXG4gICAqIFVzZSBgZG93bmdyYWRlTmcyQ29tcG9uZW50YCB0byBjcmVhdGUgYW4gQW5ndWxhckpTIERpcmVjdGl2ZSBEZWZpbml0aW9uIEZhY3RvcnkgZnJvbVxuICAgKiBBbmd1bGFyIENvbXBvbmVudC4gVGhlIGFkYXB0ZXIgd2lsbCBib290c3RyYXAgQW5ndWxhciBjb21wb25lbnQgZnJvbSB3aXRoaW4gdGhlXG4gICAqIEFuZ3VsYXJKUyB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIE1lbnRhbCBNb2RlbFxuICAgKlxuICAgKiAxLiBUaGUgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZCBieSBiZWluZyBsaXN0ZWQgaW4gQW5ndWxhckpTIHRlbXBsYXRlLiBUaGlzIG1lYW5zIHRoYXQgdGhlXG4gICAqICAgIGhvc3QgZWxlbWVudCBpcyBjb250cm9sbGVkIGJ5IEFuZ3VsYXJKUywgYnV0IHRoZSBjb21wb25lbnQncyB2aWV3IHdpbGwgYmUgY29udHJvbGxlZCBieVxuICAgKiAgICBBbmd1bGFyLlxuICAgKiAyLiBFdmVuIHRob3VnaHQgdGhlIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgaW4gQW5ndWxhckpTLCBpdCB3aWxsIGJlIHVzaW5nIEFuZ3VsYXJcbiAgICogICAgc3ludGF4LiBUaGlzIGhhcyB0byBiZSBkb25lLCB0aGlzIHdheSBiZWNhdXNlIHdlIG11c3QgZm9sbG93IEFuZ3VsYXIgY29tcG9uZW50cyBkbyBub3RcbiAgICogICAgZGVjbGFyZSBob3cgdGhlIGF0dHJpYnV0ZXMgc2hvdWxkIGJlIGludGVycHJldGVkLlxuICAgKiAzLiBgbmctbW9kZWxgIGlzIGNvbnRyb2xsZWQgYnkgQW5ndWxhckpTIGFuZCBjb21tdW5pY2F0ZXMgd2l0aCB0aGUgZG93bmdyYWRlZCBBbmd1bGFyIGNvbXBvbmVudFxuICAgKiAgICBieSB3YXkgb2YgdGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgaW50ZXJmYWNlIGZyb20gQGFuZ3VsYXIvZm9ybXMuIE9ubHkgY29tcG9uZW50cyB0aGF0XG4gICAqICAgIGltcGxlbWVudCB0aGlzIGludGVyZmFjZSBhcmUgZWxpZ2libGUuXG4gICAqXG4gICAqICMjIyBTdXBwb3J0ZWQgRmVhdHVyZXNcbiAgICpcbiAgICogLSBCaW5kaW5nczpcbiAgICogICAtIEF0dHJpYnV0ZTogYDxjb21wIG5hbWU9XCJXb3JsZFwiPmBcbiAgICogICAtIEludGVycG9sYXRpb246ICBgPGNvbXAgZ3JlZXRpbmc9XCJIZWxsbyB7e25hbWV9fSFcIj5gXG4gICAqICAgLSBFeHByZXNzaW9uOiAgYDxjb21wIFtuYW1lXT1cInVzZXJuYW1lXCI+YFxuICAgKiAgIC0gRXZlbnQ6ICBgPGNvbXAgKGNsb3NlKT1cImRvU29tZXRoaW5nKClcIj5gXG4gICAqICAgLSBuZy1tb2RlbDogYDxjb21wIG5nLW1vZGVsPVwibmFtZVwiPmBcbiAgICogLSBDb250ZW50IHByb2plY3Rpb246IHllc1xuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcihmb3J3YXJkUmVmKCgpID0+IE15TmcyTW9kdWxlKSk7XG4gICAqIGNvbnN0IG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdteUV4YW1wbGUnLCBbXSk7XG4gICAqIG1vZHVsZS5kaXJlY3RpdmUoJ2dyZWV0JywgYWRhcHRlci5kb3duZ3JhZGVOZzJDb21wb25lbnQoR3JlZXRlcikpO1xuICAgKlxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICBzZWxlY3RvcjogJ2dyZWV0JyxcbiAgICogICB0ZW1wbGF0ZTogJ3t7c2FsdXRhdGlvbn19IHt7bmFtZX19ISAtIDxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG4gICAqIH0pXG4gICAqIGNsYXNzIEdyZWV0ZXIge1xuICAgKiAgIEBJbnB1dCgpIHNhbHV0YXRpb246IHN0cmluZztcbiAgICogICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gICAqIH1cbiAgICpcbiAgICogQE5nTW9kdWxlKHtcbiAgICogICBkZWNsYXJhdGlvbnM6IFtHcmVldGVyXSxcbiAgICogICBpbXBvcnRzOiBbQnJvd3Nlck1vZHVsZV1cbiAgICogfSlcbiAgICogY2xhc3MgTXlOZzJNb2R1bGUge31cbiAgICpcbiAgICogZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPVxuICAgKiAgICduZzEgdGVtcGxhdGU6IDxncmVldCBzYWx1dGF0aW9uPVwiSGVsbG9cIiBbbmFtZV09XCJ3b3JsZFwiPnRleHQ8L2dyZWV0Pic7XG4gICAqXG4gICAqIGFkYXB0ZXIuYm9vdHN0cmFwKGRvY3VtZW50LmJvZHksIFsnbXlFeGFtcGxlJ10pLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgKiAgIGV4cGVjdChkb2N1bWVudC5ib2R5LnRleHRDb250ZW50KS50b0VxdWFsKFwibmcxIHRlbXBsYXRlOiBIZWxsbyB3b3JsZCEgLSB0ZXh0XCIpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqL1xuICBkb3duZ3JhZGVOZzJDb21wb25lbnQoY29tcG9uZW50OiBUeXBlPGFueT4pOiBGdW5jdGlvbiB7XG4gICAgdGhpcy5kb3duZ3JhZGVkQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG5cbiAgICByZXR1cm4gZG93bmdyYWRlQ29tcG9uZW50KHtjb21wb25lbnR9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgQW5ndWxhckpTIENvbXBvbmVudCB0byBiZSB1c2VkIGZyb20gQW5ndWxhci5cbiAgICpcbiAgICogVXNlIGB1cGdyYWRlTmcxQ29tcG9uZW50YCB0byBjcmVhdGUgYW4gQW5ndWxhciBjb21wb25lbnQgZnJvbSBBbmd1bGFySlMgQ29tcG9uZW50XG4gICAqIGRpcmVjdGl2ZS4gVGhlIGFkYXB0ZXIgd2lsbCBib290c3RyYXAgQW5ndWxhckpTIGNvbXBvbmVudCBmcm9tIHdpdGhpbiB0aGUgQW5ndWxhclxuICAgKiB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIE1lbnRhbCBNb2RlbFxuICAgKlxuICAgKiAxLiBUaGUgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZCBieSBiZWluZyBsaXN0ZWQgaW4gQW5ndWxhciB0ZW1wbGF0ZS4gVGhpcyBtZWFucyB0aGF0IHRoZVxuICAgKiAgICBob3N0IGVsZW1lbnQgaXMgY29udHJvbGxlZCBieSBBbmd1bGFyLCBidXQgdGhlIGNvbXBvbmVudCdzIHZpZXcgd2lsbCBiZSBjb250cm9sbGVkIGJ5XG4gICAqICAgIEFuZ3VsYXJKUy5cbiAgICpcbiAgICogIyMjIFN1cHBvcnRlZCBGZWF0dXJlc1xuICAgKlxuICAgKiAtIEJpbmRpbmdzOlxuICAgKiAgIC0gQXR0cmlidXRlOiBgPGNvbXAgbmFtZT1cIldvcmxkXCI+YFxuICAgKiAgIC0gSW50ZXJwb2xhdGlvbjogIGA8Y29tcCBncmVldGluZz1cIkhlbGxvIHt7bmFtZX19IVwiPmBcbiAgICogICAtIEV4cHJlc3Npb246ICBgPGNvbXAgW25hbWVdPVwidXNlcm5hbWVcIj5gXG4gICAqICAgLSBFdmVudDogIGA8Y29tcCAoY2xvc2UpPVwiZG9Tb21ldGhpbmcoKVwiPmBcbiAgICogLSBUcmFuc2NsdXNpb246IHllc1xuICAgKiAtIE9ubHkgc29tZSBvZiB0aGUgZmVhdHVyZXMgb2ZcbiAgICogICBbRGlyZWN0aXZlIERlZmluaXRpb24gT2JqZWN0XShodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcvc2VydmljZS8kY29tcGlsZSkgYXJlXG4gICAqICAgc3VwcG9ydGVkOlxuICAgKiAgIC0gYGNvbXBpbGVgOiBub3Qgc3VwcG9ydGVkIGJlY2F1c2UgdGhlIGhvc3QgZWxlbWVudCBpcyBvd25lZCBieSBBbmd1bGFyLCB3aGljaCBkb2VzXG4gICAqICAgICBub3QgYWxsb3cgbW9kaWZ5aW5nIERPTSBzdHJ1Y3R1cmUgZHVyaW5nIGNvbXBpbGF0aW9uLlxuICAgKiAgIC0gYGNvbnRyb2xsZXJgOiBzdXBwb3J0ZWQuIChOT1RFOiBpbmplY3Rpb24gb2YgYCRhdHRyc2AgYW5kIGAkdHJhbnNjbHVkZWAgaXMgbm90IHN1cHBvcnRlZC4pXG4gICAqICAgLSBgY29udHJvbGxlckFzYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYGJpbmRUb0NvbnRyb2xsZXJgOiBzdXBwb3J0ZWQuXG4gICAqICAgLSBgbGlua2A6IHN1cHBvcnRlZC4gKE5PVEU6IG9ubHkgcHJlLWxpbmsgZnVuY3Rpb24gaXMgc3VwcG9ydGVkLilcbiAgICogICAtIGBuYW1lYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHByaW9yaXR5YDogaWdub3JlZC5cbiAgICogICAtIGByZXBsYWNlYDogbm90IHN1cHBvcnRlZC5cbiAgICogICAtIGByZXF1aXJlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHJlc3RyaWN0YDogbXVzdCBiZSBzZXQgdG8gJ0UnLlxuICAgKiAgIC0gYHNjb3BlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlbXBsYXRlYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlbXBsYXRlVXJsYDogc3VwcG9ydGVkLlxuICAgKiAgIC0gYHRlcm1pbmFsYDogaWdub3JlZC5cbiAgICogICAtIGB0cmFuc2NsdWRlYDogc3VwcG9ydGVkLlxuICAgKlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcihmb3J3YXJkUmVmKCgpID0+IE15TmcyTW9kdWxlKSk7XG4gICAqIGNvbnN0IG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdteUV4YW1wbGUnLCBbXSk7XG4gICAqXG4gICAqIG1vZHVsZS5kaXJlY3RpdmUoJ2dyZWV0JywgZnVuY3Rpb24oKSB7XG4gICAqICAgcmV0dXJuIHtcbiAgICogICAgIHNjb3BlOiB7c2FsdXRhdGlvbjogJz0nLCBuYW1lOiAnPScgfSxcbiAgICogICAgIHRlbXBsYXRlOiAne3tzYWx1dGF0aW9ufX0ge3tuYW1lfX0hIC0gPHNwYW4gbmctdHJhbnNjbHVkZT48L3NwYW4+J1xuICAgKiAgIH07XG4gICAqIH0pO1xuICAgKlxuICAgKiBtb2R1bGUuZGlyZWN0aXZlKCduZzInLCBhZGFwdGVyLmRvd25ncmFkZU5nMkNvbXBvbmVudChOZzJDb21wb25lbnQpKTtcbiAgICpcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICduZzInLFxuICAgKiAgIHRlbXBsYXRlOiAnbmcyIHRlbXBsYXRlOiA8Z3JlZXQgc2FsdXRhdGlvbj1cIkhlbGxvXCIgW25hbWVdPVwid29ybGRcIj50ZXh0PC9ncmVldD4nXG4gICAqIH0pXG4gICAqIGNsYXNzIE5nMkNvbXBvbmVudCB7XG4gICAqIH1cbiAgICpcbiAgICogQE5nTW9kdWxlKHtcbiAgICogICBkZWNsYXJhdGlvbnM6IFtOZzJDb21wb25lbnQsIGFkYXB0ZXIudXBncmFkZU5nMUNvbXBvbmVudCgnZ3JlZXQnKV0sXG4gICAqICAgaW1wb3J0czogW0Jyb3dzZXJNb2R1bGVdXG4gICAqIH0pXG4gICAqIGNsYXNzIE15TmcyTW9kdWxlIHt9XG4gICAqXG4gICAqIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJzxuZzI+PC9uZzI+JztcbiAgICpcbiAgICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAqICAgZXhwZWN0KGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQpLnRvRXF1YWwoXCJuZzIgdGVtcGxhdGU6IEhlbGxvIHdvcmxkISAtIHRleHRcIik7XG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICovXG4gIHVwZ3JhZGVOZzFDb21wb25lbnQobmFtZTogc3RyaW5nKTogVHlwZTxhbnk+IHtcbiAgICBpZiAoKDxhbnk+dGhpcy5uZzFDb21wb25lbnRzVG9CZVVwZ3JhZGVkKS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMubmcxQ29tcG9uZW50c1RvQmVVcGdyYWRlZFtuYW1lXS50eXBlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKHRoaXMubmcxQ29tcG9uZW50c1RvQmVVcGdyYWRlZFtuYW1lXSA9IG5ldyBVcGdyYWRlTmcxQ29tcG9uZW50QWRhcHRlckJ1aWxkZXIobmFtZSkpXG4gICAgICAgICAgLnR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyB0aGUgYWRhcHRlcidzIEFuZ3VsYXJKUyB1cGdyYWRlIG1vZHVsZSBmb3IgdW5pdCB0ZXN0aW5nIGluIEFuZ3VsYXJKUy5cbiAgICogVXNlIHRoaXMgaW5zdGVhZCBvZiBgYW5ndWxhci5tb2NrLm1vZHVsZSgpYCB0byBsb2FkIHRoZSB1cGdyYWRlIG1vZHVsZSBpbnRvXG4gICAqIHRoZSBBbmd1bGFySlMgdGVzdGluZyBpbmplY3Rvci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IHVwZ3JhZGVBZGFwdGVyID0gbmV3IFVwZ3JhZGVBZGFwdGVyKE15TmcyTW9kdWxlKTtcbiAgICpcbiAgICogLy8gY29uZmlndXJlIHRoZSBhZGFwdGVyIHdpdGggdXBncmFkZS9kb3duZ3JhZGUgY29tcG9uZW50cyBhbmQgc2VydmljZXNcbiAgICogdXBncmFkZUFkYXB0ZXIuZG93bmdyYWRlTmcyQ29tcG9uZW50KE15Q29tcG9uZW50KTtcbiAgICpcbiAgICogbGV0IHVwZ3JhZGVBZGFwdGVyUmVmOiBVcGdyYWRlQWRhcHRlclJlZjtcbiAgICogbGV0ICRjb21waWxlLCAkcm9vdFNjb3BlO1xuICAgKlxuICAgKiAvLyBXZSBtdXN0IHJlZ2lzdGVyIHRoZSBhZGFwdGVyIGJlZm9yZSBhbnkgY2FsbHMgdG8gYGluamVjdCgpYFxuICAgKiBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICogICB1cGdyYWRlQWRhcHRlclJlZiA9IHVwZ3JhZGVBZGFwdGVyLnJlZ2lzdGVyRm9yTmcxVGVzdHMoWydoZXJvQXBwJ10pO1xuICAgKiB9KTtcbiAgICpcbiAgICogYmVmb3JlRWFjaChpbmplY3QoKF8kY29tcGlsZV8sIF8kcm9vdFNjb3BlXykgPT4ge1xuICAgKiAgICRjb21waWxlID0gXyRjb21waWxlXztcbiAgICogICAkcm9vdFNjb3BlID0gXyRyb290U2NvcGVfO1xuICAgKiB9KSk7XG4gICAqXG4gICAqIGl0KFwic2F5cyBoZWxsb1wiLCAoZG9uZSkgPT4ge1xuICAgKiAgIHVwZ3JhZGVBZGFwdGVyUmVmLnJlYWR5KCgpID0+IHtcbiAgICogICAgIGNvbnN0IGVsZW1lbnQgPSAkY29tcGlsZShcIjxteS1jb21wb25lbnQ+PC9teS1jb21wb25lbnQ+XCIpKCRyb290U2NvcGUpO1xuICAgKiAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICogICAgIGV4cGVjdChlbGVtZW50Lmh0bWwoKSkudG9Db250YWluKFwiSGVsbG8gV29ybGRcIik7XG4gICAqICAgICBkb25lKCk7XG4gICAqICAgfSlcbiAgICogfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gbW9kdWxlcyBhbnkgQW5ndWxhckpTIG1vZHVsZXMgdGhhdCB0aGUgdXBncmFkZSBtb2R1bGUgc2hvdWxkIGRlcGVuZCB1cG9uXG4gICAqIEByZXR1cm5zIGFuIGBVcGdyYWRlQWRhcHRlclJlZmAsIHdoaWNoIGxldHMgeW91IHJlZ2lzdGVyIGEgYHJlYWR5KClgIGNhbGxiYWNrIHRvXG4gICAqIHJ1biBhc3NlcnRpb25zIG9uY2UgdGhlIEFuZ3VsYXIgY29tcG9uZW50cyBhcmUgcmVhZHkgdG8gdGVzdCB0aHJvdWdoIEFuZ3VsYXJKUy5cbiAgICovXG4gIHJlZ2lzdGVyRm9yTmcxVGVzdHMobW9kdWxlcz86IHN0cmluZ1tdKTogVXBncmFkZUFkYXB0ZXJSZWYge1xuICAgIGNvbnN0IHdpbmRvd05nTW9jayA9ICh3aW5kb3cgYXMgYW55KVsnYW5ndWxhciddLm1vY2s7XG4gICAgaWYgKCF3aW5kb3dOZ01vY2sgfHwgIXdpbmRvd05nTW9jay5tb2R1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZpbmQgXFwnYW5ndWxhci5tb2NrLm1vZHVsZVxcJy4nKTtcbiAgICB9XG4gICAgdGhpcy5kZWNsYXJlTmcxTW9kdWxlKG1vZHVsZXMpO1xuICAgIHdpbmRvd05nTW9jay5tb2R1bGUodGhpcy5uZzFNb2R1bGUubmFtZSk7XG4gICAgY29uc3QgdXBncmFkZSA9IG5ldyBVcGdyYWRlQWRhcHRlclJlZigpO1xuICAgIHRoaXMubmcyQm9vdHN0cmFwRGVmZXJyZWQucHJvbWlzZS50aGVuKChuZzFJbmplY3RvcikgPT4ge1xuICAgICAgKDxhbnk+dXBncmFkZSkuX2Jvb3RzdHJhcERvbmUodGhpcy5tb2R1bGVSZWYsIG5nMUluamVjdG9yKTtcbiAgICB9LCBvbkVycm9yKTtcbiAgICByZXR1cm4gdXBncmFkZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCb290c3RyYXAgYSBoeWJyaWQgQW5ndWxhckpTIC8gQW5ndWxhciBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogVGhpcyBgYm9vdHN0cmFwYCBtZXRob2QgaXMgYSBkaXJlY3QgcmVwbGFjZW1lbnQgKHRha2VzIHNhbWUgYXJndW1lbnRzKSBmb3IgQW5ndWxhckpTXG4gICAqIFtgYm9vdHN0cmFwYF0oaHR0cHM6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL25nL2Z1bmN0aW9uL2FuZ3VsYXIuYm9vdHN0cmFwKSBtZXRob2QuIFVubGlrZVxuICAgKiBBbmd1bGFySlMsIHRoaXMgYm9vdHN0cmFwIGlzIGFzeW5jaHJvbm91cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFkYXB0ZXIgPSBuZXcgVXBncmFkZUFkYXB0ZXIoTXlOZzJNb2R1bGUpO1xuICAgKiBjb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICAgKiBtb2R1bGUuZGlyZWN0aXZlKCduZzInLCBhZGFwdGVyLmRvd25ncmFkZU5nMkNvbXBvbmVudChOZzIpKTtcbiAgICpcbiAgICogbW9kdWxlLmRpcmVjdGl2ZSgnbmcxJywgZnVuY3Rpb24oKSB7XG4gICAqICAgcmV0dXJuIHtcbiAgICogICAgICBzY29wZTogeyB0aXRsZTogJz0nIH0sXG4gICAqICAgICAgdGVtcGxhdGU6ICduZzFbSGVsbG8ge3t0aXRsZX19IV0oPHNwYW4gbmctdHJhbnNjbHVkZT48L3NwYW4+KSdcbiAgICogICB9O1xuICAgKiB9KTtcbiAgICpcbiAgICpcbiAgICogQENvbXBvbmVudCh7XG4gICAqICAgc2VsZWN0b3I6ICduZzInLFxuICAgKiAgIGlucHV0czogWyduYW1lJ10sXG4gICAqICAgdGVtcGxhdGU6ICduZzJbPG5nMSBbdGl0bGVdPVwibmFtZVwiPnRyYW5zY2x1ZGU8L25nMT5dKDxuZy1jb250ZW50PjwvbmctY29udGVudD4pJ1xuICAgKiB9KVxuICAgKiBjbGFzcyBOZzIge1xuICAgKiB9XG4gICAqXG4gICAqIEBOZ01vZHVsZSh7XG4gICAqICAgZGVjbGFyYXRpb25zOiBbTmcyLCBhZGFwdGVyLnVwZ3JhZGVOZzFDb21wb25lbnQoJ25nMScpXSxcbiAgICogICBpbXBvcnRzOiBbQnJvd3Nlck1vZHVsZV1cbiAgICogfSlcbiAgICogY2xhc3MgTXlOZzJNb2R1bGUge31cbiAgICpcbiAgICogZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPG5nMiBuYW1lPVwiV29ybGRcIj5wcm9qZWN0PC9uZzI+JztcbiAgICpcbiAgICogYWRhcHRlci5ib290c3RyYXAoZG9jdW1lbnQuYm9keSwgWydteUV4YW1wbGUnXSkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAqICAgZXhwZWN0KGRvY3VtZW50LmJvZHkudGV4dENvbnRlbnQpLnRvRXF1YWwoXG4gICAqICAgICAgIFwibmcyW25nMVtIZWxsbyBXb3JsZCFdKHRyYW5zY2x1ZGUpXShwcm9qZWN0KVwiKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKi9cbiAgYm9vdHN0cmFwKGVsZW1lbnQ6IEVsZW1lbnQsIG1vZHVsZXM/OiBhbnlbXSwgY29uZmlnPzogSUFuZ3VsYXJCb290c3RyYXBDb25maWcpOlxuICAgICAgVXBncmFkZUFkYXB0ZXJSZWYge1xuICAgIHRoaXMuZGVjbGFyZU5nMU1vZHVsZShtb2R1bGVzKTtcblxuICAgIGNvbnN0IHVwZ3JhZGUgPSBuZXcgVXBncmFkZUFkYXB0ZXJSZWYoKTtcblxuICAgIC8vIE1ha2Ugc3VyZSByZXN1bWVCb290c3RyYXAoKSBvbmx5IGV4aXN0cyBpZiB0aGUgY3VycmVudCBib290c3RyYXAgaXMgZGVmZXJyZWRcbiAgICBjb25zdCB3aW5kb3dBbmd1bGFyID0gKHdpbmRvdyBhcyBhbnkgLyoqIFRPRE8gIz8/Pz8gKi8pWydhbmd1bGFyJ107XG4gICAgd2luZG93QW5ndWxhci5yZXN1bWVCb290c3RyYXAgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgYm9vdHN0cmFwKGVsZW1lbnQsIFt0aGlzLm5nMU1vZHVsZS5uYW1lXSwgY29uZmlnISk7XG4gICAgfSk7XG4gICAgY29uc3QgbmcxQm9vdHN0cmFwUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAod2luZG93QW5ndWxhci5yZXN1bWVCb290c3RyYXApIHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxSZXN1bWVCb290c3RyYXA6ICgpID0+IHZvaWQgPSB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcDtcbiAgICAgICAgd2luZG93QW5ndWxhci5yZXN1bWVCb290c3RyYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcCA9IG9yaWdpbmFsUmVzdW1lQm9vdHN0cmFwO1xuICAgICAgICAgIGNvbnN0IHIgPSB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFByb21pc2UuYWxsKFt0aGlzLm5nMkJvb3RzdHJhcERlZmVycmVkLnByb21pc2UsIG5nMUJvb3RzdHJhcFByb21pc2VdKS50aGVuKChbbmcxSW5qZWN0b3JdKSA9PiB7XG4gICAgICBhbmd1bGFyRWxlbWVudChlbGVtZW50KS5kYXRhIShjb250cm9sbGVyS2V5KElOSkVDVE9SX0tFWSksIHRoaXMubW9kdWxlUmVmIS5pbmplY3Rvcik7XG4gICAgICB0aGlzLm1vZHVsZVJlZiEuaW5qZWN0b3IuZ2V0PE5nWm9uZT4oTmdab25lKS5ydW4oKCkgPT4ge1xuICAgICAgICAoPGFueT51cGdyYWRlKS5fYm9vdHN0cmFwRG9uZSh0aGlzLm1vZHVsZVJlZiwgbmcxSW5qZWN0b3IpO1xuICAgICAgfSk7XG4gICAgfSwgb25FcnJvcik7XG4gICAgcmV0dXJuIHVwZ3JhZGU7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIEFuZ3VsYXJKUyBzZXJ2aWNlIHRvIGJlIGFjY2Vzc2libGUgZnJvbSBBbmd1bGFyLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogY2xhc3MgTG9naW4geyAuLi4gfVxuICAgKiBjbGFzcyBTZXJ2ZXIgeyAuLi4gfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEV4YW1wbGUge1xuICAgKiAgIGNvbnN0cnVjdG9yKEBJbmplY3QoJ3NlcnZlcicpIHNlcnZlciwgbG9naW46IExvZ2luKSB7XG4gICAqICAgICAuLi5cbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogY29uc3QgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ215RXhhbXBsZScsIFtdKTtcbiAgICogbW9kdWxlLnNlcnZpY2UoJ3NlcnZlcicsIFNlcnZlcik7XG4gICAqIG1vZHVsZS5zZXJ2aWNlKCdsb2dpbicsIExvZ2luKTtcbiAgICpcbiAgICogY29uc3QgYWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcihNeU5nMk1vZHVsZSk7XG4gICAqIGFkYXB0ZXIudXBncmFkZU5nMVByb3ZpZGVyKCdzZXJ2ZXInKTtcbiAgICogYWRhcHRlci51cGdyYWRlTmcxUHJvdmlkZXIoJ2xvZ2luJywge2FzVG9rZW46IExvZ2lufSk7XG4gICAqXG4gICAqIGFkYXB0ZXIuYm9vdHN0cmFwKGRvY3VtZW50LmJvZHksIFsnbXlFeGFtcGxlJ10pLnJlYWR5KChyZWYpID0+IHtcbiAgICogICBjb25zdCBleGFtcGxlOiBFeGFtcGxlID0gcmVmLm5nMkluamVjdG9yLmdldChFeGFtcGxlKTtcbiAgICogfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKi9cbiAgdXBncmFkZU5nMVByb3ZpZGVyKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IHthc1Rva2VuOiBhbnl9KSB7XG4gICAgY29uc3QgdG9rZW4gPSBvcHRpb25zICYmIG9wdGlvbnMuYXNUb2tlbiB8fCBuYW1lO1xuICAgIHRoaXMudXBncmFkZWRQcm92aWRlcnMucHVzaCh7XG4gICAgICBwcm92aWRlOiB0b2tlbixcbiAgICAgIHVzZUZhY3Rvcnk6ICgkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UpID0+ICRpbmplY3Rvci5nZXQobmFtZSksXG4gICAgICBkZXBzOiBbJElOSkVDVE9SXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBBbmd1bGFyIHNlcnZpY2UgdG8gYmUgYWNjZXNzaWJsZSBmcm9tIEFuZ3VsYXJKUy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIGNsYXNzIEV4YW1wbGUge1xuICAgKiB9XG4gICAqXG4gICAqIGNvbnN0IGFkYXB0ZXIgPSBuZXcgVXBncmFkZUFkYXB0ZXIoTXlOZzJNb2R1bGUpO1xuICAgKlxuICAgKiBjb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbXlFeGFtcGxlJywgW10pO1xuICAgKiBtb2R1bGUuZmFjdG9yeSgnZXhhbXBsZScsIGFkYXB0ZXIuZG93bmdyYWRlTmcyUHJvdmlkZXIoRXhhbXBsZSkpO1xuICAgKlxuICAgKiBhZGFwdGVyLmJvb3RzdHJhcChkb2N1bWVudC5ib2R5LCBbJ215RXhhbXBsZSddKS5yZWFkeSgocmVmKSA9PiB7XG4gICAqICAgY29uc3QgZXhhbXBsZTogRXhhbXBsZSA9IHJlZi5uZzFJbmplY3Rvci5nZXQoJ2V4YW1wbGUnKTtcbiAgICogfSk7XG4gICAqXG4gICAqIGBgYFxuICAgKi9cbiAgZG93bmdyYWRlTmcyUHJvdmlkZXIodG9rZW46IGFueSk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZG93bmdyYWRlSW5qZWN0YWJsZSh0b2tlbik7XG4gIH1cblxuICAvKipcbiAgICogRGVjbGFyZSB0aGUgQW5ndWxhckpTIHVwZ3JhZGUgbW9kdWxlIGZvciB0aGlzIGFkYXB0ZXIgd2l0aG91dCBib290c3RyYXBwaW5nIHRoZSB3aG9sZVxuICAgKiBoeWJyaWQgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IGBib290c3RyYXAoKWAgYW5kIGByZWdpc3RlckZvck5nMVRlc3RzKClgLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kdWxlcyBUaGUgQW5ndWxhckpTIG1vZHVsZXMgdGhhdCB0aGlzIHVwZ3JhZGUgbW9kdWxlIHNob3VsZCBkZXBlbmQgdXBvbi5cbiAgICogQHJldHVybnMgVGhlIEFuZ3VsYXJKUyB1cGdyYWRlIG1vZHVsZSB0aGF0IGlzIGRlY2xhcmVkIGJ5IHRoaXMgbWV0aG9kXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCB1cGdyYWRlQWRhcHRlciA9IG5ldyBVcGdyYWRlQWRhcHRlcihNeU5nMk1vZHVsZSk7XG4gICAqIHVwZ3JhZGVBZGFwdGVyLmRlY2xhcmVOZzFNb2R1bGUoWydoZXJvQXBwJ10pO1xuICAgKiBgYGBcbiAgICovXG4gIHByaXZhdGUgZGVjbGFyZU5nMU1vZHVsZShtb2R1bGVzOiBzdHJpbmdbXSA9IFtdKTogSU1vZHVsZSB7XG4gICAgY29uc3QgZGVsYXlBcHBseUV4cHM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgICBsZXQgb3JpZ2luYWwkYXBwbHlGbjogRnVuY3Rpb247XG4gICAgbGV0IHJvb3RTY29wZVByb3RvdHlwZTogYW55O1xuICAgIGxldCByb290U2NvcGU6IElSb290U2NvcGVTZXJ2aWNlO1xuICAgIGNvbnN0IHVwZ3JhZGVBZGFwdGVyID0gdGhpcztcbiAgICBjb25zdCBuZzFNb2R1bGUgPSB0aGlzLm5nMU1vZHVsZSA9IGFuZ3VsYXJNb2R1bGUodGhpcy5pZFByZWZpeCwgbW9kdWxlcyk7XG4gICAgY29uc3QgcGxhdGZvcm1SZWYgPSBwbGF0Zm9ybUJyb3dzZXJEeW5hbWljKCk7XG5cbiAgICB0aGlzLm5nWm9uZSA9IG5ldyBOZ1pvbmUoe2VuYWJsZUxvbmdTdGFja1RyYWNlOiBab25lLmhhc093blByb3BlcnR5KCdsb25nU3RhY2tUcmFjZVpvbmVTcGVjJyl9KTtcbiAgICB0aGlzLm5nMkJvb3RzdHJhcERlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XG4gICAgbmcxTW9kdWxlLmNvbnN0YW50KFVQR1JBREVfQVBQX1RZUEVfS0VZLCBVcGdyYWRlQXBwVHlwZS5EeW5hbWljKVxuICAgICAgICAuZmFjdG9yeShJTkpFQ1RPUl9LRVksICgpID0+IHRoaXMubW9kdWxlUmVmIS5pbmplY3Rvci5nZXQoSW5qZWN0b3IpKVxuICAgICAgICAuZmFjdG9yeShcbiAgICAgICAgICAgIExBWllfTU9EVUxFX1JFRiwgW0lOSkVDVE9SX0tFWSwgKGluamVjdG9yOiBJbmplY3RvcikgPT4gKHtpbmplY3Rvcn0gYXMgTGF6eU1vZHVsZVJlZildKVxuICAgICAgICAuY29uc3RhbnQoTkdfWk9ORV9LRVksIHRoaXMubmdab25lKVxuICAgICAgICAuZmFjdG9yeShDT01QSUxFUl9LRVksICgpID0+IHRoaXMubW9kdWxlUmVmIS5pbmplY3Rvci5nZXQoQ29tcGlsZXIpKVxuICAgICAgICAuY29uZmlnKFtcbiAgICAgICAgICAnJHByb3ZpZGUnLCAnJGluamVjdG9yJyxcbiAgICAgICAgICAocHJvdmlkZTogSVByb3ZpZGVTZXJ2aWNlLCBuZzFJbmplY3RvcjogSUluamVjdG9yU2VydmljZSkgPT4ge1xuICAgICAgICAgICAgcHJvdmlkZS5kZWNvcmF0b3IoJFJPT1RfU0NPUEUsIFtcbiAgICAgICAgICAgICAgJyRkZWxlZ2F0ZScsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHJvb3RTY29wZURlbGVnYXRlOiBJUm9vdFNjb3BlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgdGhlIHJvb3QgYXBwbHkgc28gdGhhdCB3ZSBjYW4gZGVsYXkgZmlyc3QgY2FsbCB0byAkYXBwbHkgdW50aWwgd2VcbiAgICAgICAgICAgICAgICAvLyBib290c3RyYXAgQW5ndWxhciBhbmQgdGhlbiB3ZSByZXBsYXkgYW5kIHJlc3RvcmUgdGhlICRhcHBseS5cbiAgICAgICAgICAgICAgICByb290U2NvcGVQcm90b3R5cGUgPSByb290U2NvcGVEZWxlZ2F0ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgaWYgKHJvb3RTY29wZVByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnJGFwcGx5JykpIHtcbiAgICAgICAgICAgICAgICAgIG9yaWdpbmFsJGFwcGx5Rm4gPSByb290U2NvcGVQcm90b3R5cGUuJGFwcGx5O1xuICAgICAgICAgICAgICAgICAgcm9vdFNjb3BlUHJvdG90eXBlLiRhcHBseSA9IChleHA6IGFueSkgPT4gZGVsYXlBcHBseUV4cHMucHVzaChleHApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBmaW5kIFxcJyRhcHBseVxcJyBvbiBcXCckcm9vdFNjb3BlXFwnIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFNjb3BlID0gcm9vdFNjb3BlRGVsZWdhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgaWYgKG5nMUluamVjdG9yLmhhcygkJFRFU1RBQklMSVRZKSkge1xuICAgICAgICAgICAgICBwcm92aWRlLmRlY29yYXRvcigkJFRFU1RBQklMSVRZLCBbXG4gICAgICAgICAgICAgICAgJyRkZWxlZ2F0ZScsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24odGVzdGFiaWxpdHlEZWxlZ2F0ZTogSVRlc3RhYmlsaXR5U2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxXaGVuU3RhYmxlOiBGdW5jdGlvbiA9IHRlc3RhYmlsaXR5RGVsZWdhdGUud2hlblN0YWJsZTtcbiAgICAgICAgICAgICAgICAgIC8vIENhbm5vdCB1c2UgYXJyb3cgZnVuY3Rpb24gYmVsb3cgYmVjYXVzZSB3ZSBuZWVkIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXdXaGVuU3RhYmxlID0gZnVuY3Rpb24odGhpczogdW5rbm93biwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsV2hlblN0YWJsZS5jYWxsKHRoaXMsIGZ1bmN0aW9uKHRoaXM6IHVua25vd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZzJUZXN0YWJpbGl0eTogVGVzdGFiaWxpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICB1cGdyYWRlQWRhcHRlci5tb2R1bGVSZWYhLmluamVjdG9yLmdldChUZXN0YWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5nMlRlc3RhYmlsaXR5LmlzU3RhYmxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nMlRlc3RhYmlsaXR5LndoZW5TdGFibGUobmV3V2hlblN0YWJsZS5iaW5kKHRoaXMsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgIHRlc3RhYmlsaXR5RGVsZWdhdGUud2hlblN0YWJsZSA9IG5ld1doZW5TdGFibGU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGVzdGFiaWxpdHlEZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG5cbiAgICBuZzFNb2R1bGUucnVuKFtcbiAgICAgICckaW5qZWN0b3InLCAnJHJvb3RTY29wZScsXG4gICAgICAobmcxSW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UsIHJvb3RTY29wZTogSVJvb3RTY29wZVNlcnZpY2UpID0+IHtcbiAgICAgICAgVXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXJCdWlsZGVyLnJlc29sdmUodGhpcy5uZzFDb21wb25lbnRzVG9CZVVwZ3JhZGVkLCBuZzFJbmplY3RvcilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gTm90ZTogVGhlcmUgaXMgYSBidWcgaW4gVFMgMi40IHRoYXQgcHJldmVudHMgdXMgZnJvbVxuICAgICAgICAgICAgICAvLyBpbmxpbmluZyB0aGlzIGludG8gQE5nTW9kdWxlXG4gICAgICAgICAgICAgIC8vIFRPRE8odGJvc2NoKTogZmluZCBvciBmaWxlIGEgYnVnIGFnYWluc3QgVHlwZVNjcmlwdCBmb3IgdGhpcy5cbiAgICAgICAgICAgICAgY29uc3QgbmdNb2R1bGUgPSB7XG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAgICB7cHJvdmlkZTogJElOSkVDVE9SLCB1c2VGYWN0b3J5OiAoKSA9PiBuZzFJbmplY3Rvcn0sXG4gICAgICAgICAgICAgICAgICB7cHJvdmlkZTogJENPTVBJTEUsIHVzZUZhY3Rvcnk6ICgpID0+IG5nMUluamVjdG9yLmdldCgkQ09NUElMRSl9LFxuICAgICAgICAgICAgICAgICAgdGhpcy51cGdyYWRlZFByb3ZpZGVyc1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgaW1wb3J0czogW3Jlc29sdmVGb3J3YXJkUmVmKHRoaXMubmcyQXBwTW9kdWxlKV0sXG4gICAgICAgICAgICAgICAgZW50cnlDb21wb25lbnRzOiB0aGlzLmRvd25ncmFkZWRDb21wb25lbnRzXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2UgaGF2ZSBuZzEgaW5qZWN0b3IgYW5kIHdlIGhhdmUgcHJlcGFyZWRcbiAgICAgICAgICAgICAgLy8gbmcxIGNvbXBvbmVudHMgdG8gYmUgdXBncmFkZWQsIHdlIG5vdyBjYW4gYm9vdHN0cmFwIG5nMi5cbiAgICAgICAgICAgICAgQE5nTW9kdWxlKHtqaXQ6IHRydWUsIC4uLm5nTW9kdWxlfSlcbiAgICAgICAgICAgICAgY2xhc3MgRHluYW1pY05nVXBncmFkZU1vZHVsZSB7XG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7fVxuICAgICAgICAgICAgICAgIG5nRG9Cb290c3RyYXAoKSB7fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBsYXRmb3JtUmVmXG4gICAgICAgICAgICAgICAgICAuYm9vdHN0cmFwTW9kdWxlKFxuICAgICAgICAgICAgICAgICAgICAgIER5bmFtaWNOZ1VwZ3JhZGVNb2R1bGUsIFt0aGlzLmNvbXBpbGVyT3B0aW9ucyEsIHtuZ1pvbmU6IHRoaXMubmdab25lfV0pXG4gICAgICAgICAgICAgICAgICAudGhlbigocmVmOiBOZ01vZHVsZVJlZjxhbnk+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlUmVmID0gcmVmO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChyb290U2NvcGVQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RTY29wZVByb3RvdHlwZS4kYXBwbHkgPSBvcmlnaW5hbCRhcHBseUZuOyAgLy8gcmVzdG9yZSBvcmlnaW5hbCAkYXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChkZWxheUFwcGx5RXhwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFNjb3BlLiRhcHBseShkZWxheUFwcGx5RXhwcy5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RTY29wZVByb3RvdHlwZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLm5nMkJvb3RzdHJhcERlZmVycmVkLnJlc29sdmUobmcxSW5qZWN0b3IpLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gdGhpcy5uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgICAgICAgICAgIG5leHQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb290U2NvcGUuJCRwaGFzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBIGRpZ2VzdCB3YXMgdHJpZ2dlcmVkIHdoaWxlIG9uZSB3YXMgYWxyZWFkeSBpbiBwcm9ncmVzcy4gVGhpcyBtYXkgbWVhbiB0aGF0IHNvbWV0aGluZyBpcyB0cmlnZ2VyaW5nIGRpZ2VzdHMgb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RTY29wZS4kZXZhbEFzeW5jKCgpID0+IHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RTY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcm9vdFNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB0aGlzLm5nMkJvb3RzdHJhcERlZmVycmVkLnJlamVjdChlKSk7XG4gICAgICB9XG4gICAgXSk7XG5cbiAgICByZXR1cm4gbmcxTW9kdWxlO1xuICB9XG59XG5cbi8qKlxuICogU3luY2hyb25vdXMgcHJvbWlzZS1saWtlIG9iamVjdCB0byB3cmFwIHBhcmVudCBpbmplY3RvcnMsXG4gKiB0byBwcmVzZXJ2ZSB0aGUgc3luY2hyb25vdXMgbmF0dXJlIG9mIEFuZ3VsYXJKUydzICRjb21waWxlLlxuICovXG5jbGFzcyBQYXJlbnRJbmplY3RvclByb21pc2Uge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBpbmplY3RvciE6IEluamVjdG9yO1xuICBwcml2YXRlIGNhbGxiYWNrczogKChpbmplY3RvcjogSW5qZWN0b3IpID0+IGFueSlbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSkge1xuICAgIC8vIHN0b3JlIHRoZSBwcm9taXNlIG9uIHRoZSBlbGVtZW50XG4gICAgZWxlbWVudC5kYXRhIShjb250cm9sbGVyS2V5KElOSkVDVE9SX0tFWSksIHRoaXMpO1xuICB9XG5cbiAgdGhlbihjYWxsYmFjazogKGluamVjdG9yOiBJbmplY3RvcikgPT4gYW55KSB7XG4gICAgaWYgKHRoaXMuaW5qZWN0b3IpIHtcbiAgICAgIGNhbGxiYWNrKHRoaXMuaW5qZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlKGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuaW5qZWN0b3IgPSBpbmplY3RvcjtcblxuICAgIC8vIHJlc2V0IHRoZSBlbGVtZW50IGRhdGEgdG8gcG9pbnQgdG8gdGhlIHJlYWwgaW5qZWN0b3JcbiAgICB0aGlzLmVsZW1lbnQuZGF0YSEoY29udHJvbGxlcktleShJTkpFQ1RPUl9LRVkpLCBpbmplY3Rvcik7XG5cbiAgICAvLyBjbGVhbiBvdXQgdGhlIGVsZW1lbnQgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcbiAgICB0aGlzLmVsZW1lbnQgPSBudWxsITtcblxuICAgIC8vIHJ1biBhbGwgdGhlIHF1ZXVlZCBjYWxsYmFja3NcbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soaW5qZWN0b3IpKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICB9XG59XG5cblxuLyoqXG4gKiBVc2UgYFVwZ3JhZGVBZGFwdGVyUmVmYCB0byBjb250cm9sIGEgaHlicmlkIEFuZ3VsYXJKUyAvIEFuZ3VsYXIgYXBwbGljYXRpb24uXG4gKlxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBzaW5jZSB2NS4gVXNlIGB1cGdyYWRlL3N0YXRpY2AgaW5zdGVhZCwgd2hpY2ggYWxzbyBzdXBwb3J0c1xuICogW0FoZWFkLW9mLVRpbWUgY29tcGlsYXRpb25dKGd1aWRlL2FvdC1jb21waWxlcikuXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGdyYWRlQWRhcHRlclJlZiB7XG4gIC8qIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9yZWFkeUZuOiAoKHVwZ3JhZGVBZGFwdGVyUmVmOiBVcGdyYWRlQWRhcHRlclJlZikgPT4gdm9pZCl8bnVsbCA9IG51bGw7XG5cbiAgcHVibGljIG5nMVJvb3RTY29wZTogSVJvb3RTY29wZVNlcnZpY2UgPSBudWxsITtcbiAgcHVibGljIG5nMUluamVjdG9yOiBJSW5qZWN0b3JTZXJ2aWNlID0gbnVsbCE7XG4gIHB1YmxpYyBuZzJNb2R1bGVSZWY6IE5nTW9kdWxlUmVmPGFueT4gPSBudWxsITtcbiAgcHVibGljIG5nMkluamVjdG9yOiBJbmplY3RvciA9IG51bGwhO1xuXG4gIC8qIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9ib290c3RyYXBEb25lKG5nTW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LCBuZzFJbmplY3RvcjogSUluamVjdG9yU2VydmljZSkge1xuICAgIHRoaXMubmcyTW9kdWxlUmVmID0gbmdNb2R1bGVSZWY7XG4gICAgdGhpcy5uZzJJbmplY3RvciA9IG5nTW9kdWxlUmVmLmluamVjdG9yO1xuICAgIHRoaXMubmcxSW5qZWN0b3IgPSBuZzFJbmplY3RvcjtcbiAgICB0aGlzLm5nMVJvb3RTY29wZSA9IG5nMUluamVjdG9yLmdldCgkUk9PVF9TQ09QRSk7XG4gICAgdGhpcy5fcmVhZHlGbiAmJiB0aGlzLl9yZWFkeUZuKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hpY2ggaXMgbm90aWZpZWQgdXBvbiBzdWNjZXNzZnVsIGh5YnJpZCBBbmd1bGFySlMgLyBBbmd1bGFyXG4gICAqIGFwcGxpY2F0aW9uIGhhcyBiZWVuIGJvb3RzdHJhcHBlZC5cbiAgICpcbiAgICogVGhlIGByZWFkeWAgY2FsbGJhY2sgZnVuY3Rpb24gaXMgaW52b2tlZCBpbnNpZGUgdGhlIEFuZ3VsYXIgem9uZSwgdGhlcmVmb3JlIGl0IGRvZXMgbm90XG4gICAqIHJlcXVpcmUgYSBjYWxsIHRvIGAkYXBwbHkoKWAuXG4gICAqL1xuICBwdWJsaWMgcmVhZHkoZm46ICh1cGdyYWRlQWRhcHRlclJlZjogVXBncmFkZUFkYXB0ZXJSZWYpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9yZWFkeUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZSBvZiBydW5uaW5nIGh5YnJpZCBBbmd1bGFySlMgLyBBbmd1bGFyIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5uZzFJbmplY3RvciEuZ2V0KCRST09UX1NDT1BFKS4kZGVzdHJveSgpO1xuICAgIHRoaXMubmcyTW9kdWxlUmVmIS5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==