import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Account} from "./models/AccountModel";
import {AccountStatus, Roles} from "./constants/enums";
import {useAppDispatch} from "@/redux/hooks.tsx";
import {getCookie, removeCookie} from "@/utils/cookies.ts";
import {API_SERVER} from "@/constants/domain.ts";
import axios from "./config/axiosConfig.ts";
import {AuthResponse} from "@/models/AuthResponse.ts";
import {countUnreadNotifications} from "@/services/NotificationService.ts";
import {
    setUnreadNotificationCount
} from "@/redux/reducers/UnreadNotificationCountReducer.ts";
import LoadingScreen from "@/pages/LoadingScreen.tsx";

type Props = {
    children?: ReactNode;
}

type IAuthContecxt = {
    user: Account;
    setUser: (newState: Account) => void;
    isAuthenticated: () => boolean;
    fetchProfile: () => void;
}

const initalUser: Account = {
    accessToken: undefined,
    accountId: -1,
    avatar: undefined,
    balance: 0,
    createDate: undefined,
    email: "",
    nickname: undefined,
    phone: "",
    role: Roles.GUEST,
    status: AccountStatus.ACTIVE,
    updateDate: undefined
}

const initialValue = {
    user: initalUser,
    setUser: () => { },
    isAuthenticated: () => {
        return false;
    },
    fetchProfile: () => {},
}

const AuthContext = createContext<IAuthContecxt>(initialValue);

export const AuthProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState(initialValue.user);
    const [loading, setLoading] = useState(false);
    const isAuthenticated = () => {
        return user.accountId > 0;
    }
    const fetchProfile = async () => {
        const userCookie = getCookie("user");
        console.log(userCookie);
        const userData = JSON.parse(userCookie || "{}") as AuthResponse;
        if (userData?.id == 0 || userData?.accessToken === undefined)
            return;
        try {
            await axios
                .get(API_SERVER + "/accounts/" + userData?.id, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Bearer " + userData?.accessToken || "",
                    }
                })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    if (err?.response.status == 401) {
                        removeCookie("user");
                        removeCookie("token");
                    }
                });

        } catch (err: any) {}
    }

    useEffect(() => {
        setLoading(true);
        fetchProfile().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        // Check if user is null and reset to initialUser if so
        if (user === null) {
            setUser(initalUser);
            return;
        }

        const handleUserChange = () => {
            if (isAuthenticated()) {
                countUnreadNotifications().then((r) => {
                    dispatch(setUnreadNotificationCount(r.data));
                });
            } else {
                dispatch(setUnreadNotificationCount(0));
            }
        };
        handleUserChange();
    }, [user, dispatch]);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, fetchProfile }}>
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