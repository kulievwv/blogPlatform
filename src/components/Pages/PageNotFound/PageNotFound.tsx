import React from "react";
import './pageNotFound.css';

export const PageNotFound: React.FC = () => {
    return(
        <div className="message">
            
            <img src="https://ltdfoto.ru/images/2023/12/26/notFound.png" alt="404" className="image"></img>
            <p className=""> Упс... Кажется, вы нашли гидру, но не нашли страницу</p>
        </div>
        
    )
}