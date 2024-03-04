import '../App.css';

export default function Message({ content, sendersName, own }) {

    let messageClassName;
    own? messageClassName = "messageFromMe" : messageClassName = "messageForMe";
    
    let messageWrapperClassName;
    own? messageWrapperClassName = "messageWrapperFromMe" : messageWrapperClassName = "messageForMe";

    return(
        <div className={"messageWrapper " + messageWrapperClassName} >
            <div className={"message " + messageClassName} >
                <p>{content}</p>
                <p>{sendersName}</p>
            </div>
        </div>
    )
}