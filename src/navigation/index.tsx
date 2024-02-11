import { PropsWithChildren } from "react";
import { SingInOut } from "../components/SingInOut/SingInOut";

export const Navigation = ({children}: PropsWithChildren<{}>) => {
    return <>
        <nav style={{marginBottom: 24, padding: 24, backgroundColor: 'lightgreen'}}>
            <SingInOut />
        </nav>
        {children}
    </>
    
}
