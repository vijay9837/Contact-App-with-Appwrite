import React from 'react';
import { FaCheck } from "react-icons/fa";

const Message = ({ children, bgColor = 'bg-red-500/30', borderColor = 'border-red-500', icon = <FaCheck className='text-[25px] text-green-500' /> }) => {
    return (
        <div className='absolute w-9/10 h-full justify-center flex -top-30 anime'>
            <div className={`${bgColor} ${borderColor} border absolute flex justify-center items-center gap-4 text-white p-3 text-[20px] font-bold rounded mb-4 w-full text-center`}>
                {children} {icon}
            </div>

            <style>
                {`
                    @keyframes anime {
                        from {
                            top:5%
                        }
                        to {
                            top:0%
                        }
                    }
                    .anime {
                        animation: anime 1s linear;
                    }
                `}
            </style>
        </div>
    );
};

export default Message;
