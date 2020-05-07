'user strict';

app.controller('homeController', function ($scope, $routeParams, $location, appService, $mdSidenav){
    
    const UserId = $routeParams.userId;
    $scope.title = 'Shopping Cart';
      
    $scope.$on('$viewContentLoaded', () => { 
        document.getElementById('pages').classList.add('pages-sidenav');
        $scope.openNav();
    });
    $scope.data = {
        username: '',
        chatlist: [],
        selectedFriendId: null,
        selectedFriendName: null,
        messages: []
    };

    appService.connectSocketServer(UserId);

    appService.httpCall({
        url: '/userSessionCheck',
        params: {
            'userId': UserId
        }
    })
    .then((response) => {
        $scope.data.username = response.username;
        appService.socketEmit(`chat-list`, UserId);
        appService.socketOn('chat-list-response', (response) => {
            $scope.$apply( () =>{
                if (!response.error) {
                    if (response.singleUser) {
                        /* 
                        * Removing duplicate user from chat list array
                        */
                        if ($scope.data.chatlist.length > 0) {
                            $scope.data.chatlist = $scope.data.chatlist.filter(function (obj) {
                                return obj.id !== response.chatList.id;
                            });
                        }
                        /* 
                        * Adding new online user into chat list array
                        */
                        $scope.data.chatlist.push(response.chatList);
                    } else if (response.userDisconnected) {
                        /* 
                        * Removing a user from chat list, if user goes offline
                        */
                        $scope.data.chatlist = $scope.data.chatlist.filter(function (obj) {
                            return obj.socketid !== response.socketId;
                        });
                    } else {
                        /* 
                        * Updating entire chatlist if user logs in
                        */
                        $scope.data.chatlist = response.chatList;
                    }
                } else {
                    alert(`Faild to load Chat list`);
                }
            });
        });

        /*
        * This eventt will display the new incmoing message
        */
        appService.socketOn('add-message-response', (response) => {
            $scope.$apply( () => {
                if (response && response.fromUserId == $scope.data.selectedFriendId) {
                    $scope.data.messages.push(response);
                    appService.scrollToBottom();
                }
            });
        });       
    })
    .catch((error) => {
        console.log(error.message);
        $scope.$apply( () =>{
            $location.path(`/`);
        });
    });


    $scope.selectFriendToChat = (friendId) => {
        /*
        * Highlighting the selected user from the chat list
        */
        const friendData = $scope.data.chatlist.filter((obj) => {
            return obj.id === friendId;
        });
        $scope.data.selectedFriendName = friendData[0]['username'];
        $scope.data.selectedFriendId = friendId;
        /**
        * This HTTP call will fetch chat between two users
        */
        appService.getMessages(UserId, friendId).then( (response) => {
            $scope.$apply(() => {
                $scope.data.messages = response.messages;
            });
        }).catch( (error) => {
            console.log(error);
            alert('Unexpected Error, Contact your Site Admin.');
        });
    }

    $scope.sendMessage = (event) => {

        if (event.keyCode === 13) {

            let toUserId = null;
            let toSocketId = null;

            /* Fetching the selected User from the chat list starts */
            let selectedFriendId = $scope.data.selectedFriendId;
            if (selectedFriendId === null) {
                return null;
            }
            friendData = $scope.data.chatlist.filter((obj) => {
                return obj.id === selectedFriendId;
            });
            /* Fetching the selected User from the chat list ends */
            
            /* Emmiting socket event to server with Message, starts */
            if (friendData.length > 0) {

                toUserId = friendData[0]['id'];
                toSocketId = friendData[0]['socketid'];            

                let messagePacket = {
                    message: document.querySelector('#message').value,
                    fromUserId: UserId,
                    toUserId: toUserId,
                    toSocketId: toSocketId
                };
                $scope.data.messages.push(messagePacket);
                appService.socketEmit(`add-message`, messagePacket);

                document.querySelector('#message').value = '';
                appService.scrollToBottom();
            }else {
                alert('Unexpected Error Occured,Please contact Admin');
            }
            /* Emmiting socket event to server with Message, ends */
        }
    }

    $scope.alignMessage = (fromUserId) => {
        return fromUserId == UserId ? true : false;
    }

    $scope.logout = () => {
        appService.socketEmit(`logout`, UserId);
        $location.path(`/`);
    }

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
});