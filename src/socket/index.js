const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
};

module.exports = function (socketIo) {
  socketIo.on("connection", function (socket) {
    // 클라이언트와 연결이 되면 연결된 사실을 출력합니다.
    console.log("socket connection succeeded.");

    socket.on("disconnect", reason => {
      // 클라이언트와 연결이 끊어지면 이유를 출력해줍니다.
      console.log(`disconnect: ${reason}`);
    })

    Object.keys(SOCKET_EVENT).forEach(typeKey => {
      const type = SOCKET_EVENT[typeKey];

      // 구현 편의상, 모든 클라이언트의 방 번호는 모두 "room 1"으로 배정해줍니다.
      const roomName = "room 1";

      socket.on(type, requestData => {
        const firstVisit = type === SOCKET_EVENT.JOIN_ROOM;

        if(firstVisit) {
          // 콜백함수의 파라미터는 클라이언트에서 보내주는 데이터입니다.
          socket.join(roomName);
        }

        // "room 1"에는 이벤트타입과 서버에서 받은 시각을 덧붙여 데이터를 그대로 전송해줍니다.
        const responseData = {
          ...requestData,
          type: SOCKET_EVENT.SEND_MESSAGE,
          time: new Date(),
        };

        // "room 1"에는 이벤트타입과 서버에서 받은 시각을 덧붙여 데이터를 그대로 전송해줍니다.
        socketIo.to(roomName).emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
        console.log(`${type} is fired with data: ${JSON.stringify(responseData)}`);
      })
    })
  })
}
