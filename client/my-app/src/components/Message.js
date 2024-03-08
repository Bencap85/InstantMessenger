import '../App.css';
import { state, useState, useEffect } from 'react';

export default function Message({ content, sender, own, time }) {

    const [ messageClassName, setMessageClassName ] = useState("message " + (own? "messageFromMe" : "messageForMe"));
    const messageWrapperClassName = own? "messageWrapperFromMe" : "messageWrapperForMe";


    return(
        <div className={"messageWrapper " + messageWrapperClassName} >
            { (messageWrapperClassName === 'messageWrapperForMe')? (messageClassName.indexOf('hovered') > -1? <span className={'messageTime'}>{time}</span> : null) : null }
            <div className={ messageClassName}
             onMouseEnter={((e) => {
                e.target.className += ' hovered';
                setMessageClassName(messageClassName+' hovered');
                
            })} 
            onMouseLeave={((e) => {
                e.target.className = e.target.className.replace(/hovered/g, '').trim();
                setMessageClassName(messageClassName.replace(/hovered/g, '').trim());
                
            })}>
                <p className={"messageContent"}>{content}</p>
                <p className={"messageSenderName"}>{sender}</p>
            </div>
            { (messageWrapperClassName === 'messageWrapperFromMe')? (messageClassName.indexOf('hovered') > -1? <span className={'messageTime'}>{time}</span> : null) : null }
        </div>
    )
}