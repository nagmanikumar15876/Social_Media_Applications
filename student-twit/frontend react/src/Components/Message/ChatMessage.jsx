// import React from 'react';
// import { useSelector } from 'react-redux';

// const ChatMessage = ({ item}) => {

//     const {message , auth} = useSelector(store=>store);
//     const isReqUserMessage = auth.user?.id === item.user?.id; // Replace with actual logic to determine if the message is from the logged-in user
    
//   return (
//     <div className={`flex text-white ${!isReqUserMessage ? "justify-end" : "justify-start"}`}>
//       <div 
//         className={`p-1 bg-[#191c29] ${
//           true ? "rounded-md" : "px-5 rounded-full"
//         }`}
//       >
//         {/* Conditional rendering for the message image */}


//         {item.image && (
//           <img 
//             className="w-[12rem] h-[17rem] object-cover rounded-md" 
//             src="https://via.placeholder.com/150" // Replace with your dynamic image source variable
//             alt="chat attachment" 
//           />
//         )}
        
//         {/* Message text element */}


//         <p className={true ? "py-2" : "py-1"}>
//           {item.content}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;

import React from 'react';
import { useSelector } from 'react-redux';

const ChatMessage = ({ item, onImageClick }) => {

    const { auth } = useSelector(store => store);

    const isReqUserMessage =
        auth.user?.id === item.user?.id;


    return (
        <div className={`flex text-white ${
            isReqUserMessage ? "justify-end" : "justify-start"
        }`}>
            <div className="p-2 bg-[#191c29] rounded-md">

                {item.image && (
                    <img
                        className="w-[12rem] h-[17rem] object-cover rounded-md cursor-pointer"
                        src={item.image}
                        alt="chat attachment"
                        onClick={() => onImageClick(item.image)}
                    />
                )}

                {item.content && (
                    <p className="py-2">
                        {item.content}
                    </p>
                )}

            </div>
        </div>
    );
};

export default ChatMessage;