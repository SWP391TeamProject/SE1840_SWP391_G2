import { ReactNode, createContext, useState } from "react";
import { Account } from "./models/AccountModel";
import { Roles } from "./constants/enums";

type Props = {
    children?: ReactNode;
}

type IAuthContecxt = {
    user: Account;
    setUser: (newState: Account) => void;
}

const initalUser: Account = {
    userId: -1,
    username: '',
    email: '',
    nickname: '',
    phone: '',
    avatar: '',
    accessToken: '',
    role: Roles.GUEST
}

const initialValue = {
    user: initalUser,
    setUser: () => { },
}

const AuthContext = createContext<IAuthContecxt>(initialValue);

export const AuthProvider = ({ children }: Props) => {

    const [user, setUser] = useState(initialValue.user);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;