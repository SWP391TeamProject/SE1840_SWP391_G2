import {ReactNode, createContext, useState, useEffect, useContext} from "react";
import { Account } from "./models/AccountModel";
import { Roles } from "./constants/enums";
import {useAppDispatch} from "@/redux/hooks.tsx";
import {getCookie, removeCookie} from "@/utils/cookies.ts";
import {API_SERVER} from "@/constants/domain.ts";
import axios from "axios";
import {AuthResponse} from "@/models/AuthResponse.ts";
import {countUnreadNotifications} from "@/services/NotificationService.ts";
import { setUnreadNotificationCount } from "@/redux/reducers/UnreadNotificationCountReducer.ts";
import LoadingScreen from "@/pages/LoadingScreen.tsx";

type Props = {
    children?: ReactNode;
}

type IAuthContecxt = {
    user: Account;
    setUser: (newState: Account) => void;
}

const initalUser: Account = {
    accountId: -1,
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
    const dispatch = useAppDispatch();
    const [user, setUser] = useState(initialValue.user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const userCookie = getCookie("user");
            console.log(userCookie);
            const userData = JSON.parse(userCookie || "{}") as AuthResponse;
            if (userData.id == 0)
                return;
            try {
                const response = await axios
                    .get(API_SERVER + "/accounts/" + userData.id, {
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Authorization": "Bearer " + JSON.parse(getCookie("user") || "{}").accessToken || "",
                        }
                    })
                    .catch((err) => {
                        if (err?.response.status == 401) {
                            removeCookie("user");
                            removeCookie("token");
                        }
                    });
                if (!response.status) {
                    return;
                }
                setUser(response.data);
            } catch (err: any) {
            }
        }

        async function fetchUnreadNotification() {
            if (user.accessToken === undefined) return;
            countUnreadNotifications().then((r) => {
                dispatch(setUnreadNotificationCount(r.data));
            });
        }

        // fake loading
        const delay = Math.random() < 0.3 ? 5000 : 0;

        setLoading(true);
        fetchProfile()
            .then(() => fetchUnreadNotification())
            .then(() => setTimeout(() => setLoading(false), delay));
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {loading ? LoadingScreen() : children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

export const useAuth = (): IAuthContecxt => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};