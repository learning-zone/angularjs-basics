'user strict';

app.controller('menuController', function ($scope, $routeParams, $location, $mdSidenav){
    
    console.log('menuController');
    $scope.project_name = 'Shopping Cart';
    $scope.currentTheme = "green";
      
    $scope.$on('$viewContentLoaded', () => { 
        document.getElementById('pages').classList.add('pages-sidenav');
        $scope.openNav();
    });

    /** Sidebar Menu  **/
    $scope.menus = [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          active: false,
          path: 'dashboard'
        },
        {
          title: 'Products',
          icon: 'pages',
          active: false,
          type: 'dropdown',
          submenus: [
            {
              title: 'Products',
              icon: 'radio_button_checked',
              path: 'products'
            },
            {
                title: 'Out Of Stock',
                icon: 'radio_button_checked',
                path: 'out-of-stock'
            },
            {
                title: 'Expired Products',
                icon: 'radio_button_checked',
                path: 'expired-products'
            },
            {
                title: 'Products Tax',
                icon: 'radio_button_checked',
                path: 'products-tax'
            },
            {
                title: 'Products Categories',
                icon: 'radio_button_checked',
                path: 'products-categories'
            }
          ]
        },
        {
            title: 'Warehouses',
            icon: 'store',
            active: false,
            path: 'warehouses'
        },
        {
            title: 'Suppliers',
            icon: 'people_outline',
            active: false,
            path: 'suppliers'
        },
        {
            title: 'Purchases',
            icon: 'shopping_cart',
            active: false,
            type: 'dropdown',
            submenus: [
              {
                title: 'New Purchases',
                icon: 'radio_button_checked',
                path: 'new-purchases'
              },
              {
                  title: 'Purchase List',
                  icon: 'radio_button_checked',
                  path: 'purchase-list'
              }
            ]
          },
          {
            title: 'Customers',
            icon: 'people',
            active: false,
            path: 'customers'
          },
          {
            title: 'Companies',
            icon: 'shop',
            active: false,
            path: 'companies'
          },
          {
            title: 'Sales Order',
            icon: 'add_shopping_cart',
            active: false,
            type: 'dropdown',
            submenus: [
              {
                title: 'Manage Orders',
                icon: 'radio_button_checked',
                path: 'manage-orders'
              },
              {
                  title: 'Add New Order',
                  icon: 'radio_button_checked',
                  path: 'add-new-order'
              },
              {
                title: 'Order Quotes',
                icon: 'radio_button_checked',
                path: 'order-quotes'
              },
              {
                title: 'Add Order Quote',
                icon: 'radio_button_checked',
                path: 'add-order-quote'
              }
            ]
          },
          {
            title: 'Calendar',
            icon: 'calendar_today',
            active: false,
            path: 'calendar'
          },
          {
            title: 'Expenditure',
            icon: 'attach_money',
            active: false,
            path: 'expenditure'
          },
          {
            title: 'Reports',
            icon: 'bar_chart',
            active: false,
            type: 'dropdown',
            submenus: [
              {
                title: 'Today Reports',
                icon: 'radio_button_checked',
                path: 'today-reports'
              },
              {
                  title: 'Purchase Report',
                  icon: 'radio_button_checked',
                  path: 'purchase-report'
              },
              {
                title: 'Sales Report',
                icon: 'radio_button_checked',
                path: 'sales-report'
              }
            ]
          },
          {
            title: 'System',
            icon: 'settings',
            active: false,
            type: 'dropdown',
            submenus: [
              {
                title: 'Multi Language',
                icon: 'radio_button_checked',
                path: 'multi-language'
              },
              {
                  title: 'Settings',
                  icon: 'radio_button_checked',
                  path: 'Settings'
              },
              {
                title: 'Payment Gateway',
                icon: 'radio_button_checked',
                path: 'payment-gateway'
              },
              {
                title: 'Theme Settings',
                icon: 'radio_button_checked',
                path: 'theme-settings'
              },
              {
                title: 'Constants',
                icon: 'radio_button_checked',
                path: 'constants'
              },
              {
                title: 'Database Backup',
                icon: 'radio_button_checked',
                path: 'database-backup'
              },
              {
                title: 'Email Templates',
                icon: 'radio_button_checked',
                path: 'email-templates'
              },
              {
                title: 'Staff',
                icon: 'radio_button_checked',
                path: 'staff'
              },
              {
                title: 'Staff Roles & Privileges',
                icon: 'radio_button_checked',
                path: 'staff-roles-privileges'
              },
              {
                title: 'Transactions Log',
                icon: 'radio_button_checked',
                path: 'transactions-log'
              }
            ]
          },
          {
            title: 'Logout',
            icon: 'power_settings_new',
            active: false,
            path: 'Logout'
          }
      ];

    $scope.sideNav = () => { 
        document.getElementById('pages').classList.toggle('pages-sidenav');
    }
    
    $scope.toggleNav = () => {  
        $mdSidenav("left").toggle();
    }

    $scope.openNav = () => {
        $mdSidenav("left").open();
    }

    $scope.closeNav = () => {
        $mdSidenav("left").close();
    }

    $scope.goTo = (link) => {
        $mdSidenav("left").open();
        $location.path(link);
    }

    // Menu Toggle
    $scope.collapseAll = function(data) {
      for(var i in $scope.menus) {
          if($scope.menus[i] != data) {
              $scope.menus[i].expanded = false;
          }
      }
      data.expanded = !data.expanded;
   };
});
