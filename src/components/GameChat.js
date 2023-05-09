import React, { useContext, useEffect, useState } from 'react'
import {SocketContext} from '../utils/Socket';
import EmojiPicker from 'emoji-picker-react';
import {ReactComponent as HappyFaceSVG} from "../assets/svg/happy-face.svg";
import {ReactComponent as SendSVG} from "../assets/svg/send.svg";

function GameChat({ room, userName }) {
  const socket = useContext(SocketContext);

  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // emits message, room, and userName to the backend
  const sendMessage = () => {
    socket.emit('send_message', { message, room, userName });
    setMessage("")
  }

  useEffect(() => {
    // listens for message data relayed from the backend
    socket.on('receive_message', (data) => {
      setMessageReceived(data);
    })
  }, [socket]);

  useEffect(() => {
    if (messageReceived !== '') {
      setChatLog(prevChatLog => {
        prevChatLog.unshift(messageReceived);
        // returns a new array with the spread operator containing the updated chatLog state
        return [...prevChatLog];
      });
    }
  }, [messageReceived]);

  const onEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className='opacity-90 relative'>
      {showEmojiPicker && 
        <div className='absolute bottom-2'>
          <EmojiPicker 
            height={280} 
            width={270}
            className="w-full" 
            searchDisabled={true}
            skinTonesDisabled={true}
            emoji="smileys_people"
            onEmojiClick={onEmojiClick}
          />
        </div>
      }
      <div id="chatbox"className="hover:shadow-xl hover:shadow-cyan-500/50">
        <div className='flex flex-row mb-2.5'>
          <div className="flex items-center px-1 py-2 w-full rounded-lg bg-sky-100 gap-0.5">
            <input 
              placeholder={"Message... " }
              maxLength="50"
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block basis-4/5 p-2.5'
              onChange={(event)=> { setMessage(event.target.value)}} 
              value={message}
            />
            <HappyFaceSVG 
              height="30px" 
              width="30px" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="ml-1 hover:bg-yellow-100 rounded-full"
            />
            <button 
              type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 "
              onClick={sendMessage}
            >
              <SendSVG 
                height="35px" 
                width="35px"
              />
            </button>
          </div>
        </div>

        <div  className='border border-blue-200 h-96 overflow-y-scroll rounded-lg shadow-md bg-sky-100 '>
          <div >
            {chatLog.map((message, index) => (
              <p 
                key={index} 
                className="text-left ml-2.5 text-xl"
                style={{ 
                  color: message.userName === userName ? '#ECBE07' : 'black', 
                  padding: '10px' 
                }}  
              > 
                <strong>{message.userName}</strong>: {message.message}
              </p>
            ))}
          </div>
        </div>
      </div>


    </div>
  )
}

export default GameChat