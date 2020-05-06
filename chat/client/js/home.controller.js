'user strict';

app.controller('homeController', function ($scope, $routeParams, $location, appService){
    
    const UserId = $routeParams.userId;

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
});