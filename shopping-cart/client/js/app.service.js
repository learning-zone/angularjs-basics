'use strict';

class AppService{
    constructor($http){
        this.$http = $http;
        this.socket =  null;
    }
    httpCall(httpData){
        if (httpData.url === undefined || httpData.url === null || httpData.url === ''){
            alert(`Invalid HTTP call`);
        }
        const HTTP = this.$http;
        const params = httpData.params;
        return new Promise( (resolve, reject) => {
            HTTP.post(httpData.url, params).then( (response) => {
                resolve(response.data);
            }).catch( (response, status, header, config) => {
                reject(response.data);
            });
        });
    }
    connectSocketServer(userId){
        const socket = io.connect( { query: `userId=${userId}` });
        this.socket = socket;
    }

    socketEmit(eventName, params){
        this.socket.emit(eventName, params);
    }

    socketOn(eventName, callback) {
        this.socket.on(eventName, (response) => {
            if (callback) {
                callback(response);
            }
        });
    }
    
    getMessages(userId, friendId) {
        return new Promise((resolve, reject) => {
            this.httpCall({
                url: '/getMessages',
                params: {
                    'userId': userId,
                    'toUserId': friendId
                }
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    scrollToBottom(){
        const messageThread = document.querySelector('.message-thread');
        setTimeout(() => {
            messageThread.scrollTop = messageThread.scrollHeight + 500;
        }, 10);        
    }
}
