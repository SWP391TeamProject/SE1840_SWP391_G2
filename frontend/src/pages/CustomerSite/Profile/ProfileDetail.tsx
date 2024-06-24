import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CameraIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/AuthProvider.tsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { API_SERVER } from "@/constants/domain.ts";
import { toast } from "react-toastify";
import axios from "axios";
import ChangePassword from "./profile-detail/ChangePassword";
import { Checkbox } from "@/components/ui/checkbox.tsx";

type ProfileAvatar = {
  files?: FileList;
}

type ProfileDetails = {
  nickname: string;
  phone: string;
}

type TwoFactorAuth = {
  enable2fa: boolean;
  currentPassword: string;
}

const ProfileDetail = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const {
    register: profileAvatarForm,
    handleSubmit: handleProfileAvatarForm
  } = useForm<ProfileAvatar>({
    defaultValues: {
      files: undefined
    }
  });
  const {
    register: profileDetailForm,
    handleSubmit: handleProfileDetailForm
  } = useForm<ProfileDetails>({
    defaultValues: {
      nickname: auth.user.nickname,
      phone: auth.user.phone
    }
  });
  const {
    register: twoFactorAuthForm,
    handleSubmit: handleTwoFactorAuthForm,
    reset: resetTwoFactorAuthForm,
    control: controlTwoFactorAuth
  } = useForm<TwoFactorAuth>({
    defaultValues: {
      enable2fa: auth.user.require2fa,
      currentPassword: ""
    }
  });

  useEffect(() => {
    if (auth.user.avatar)
      setAvatarPreview(auth.user.avatar.link)
  }, []);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfileAvatar: SubmitHandler<ProfileAvatar> = (data) => {
    if (data.files === undefined) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", data.files[0]);
    axios.post<any>(API_SERVER + "/accounts/avatar/" + auth.user.accountId, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then((res) => {
      auth.setUser({
        ...auth.user,
        avatar: res.data
      });
      toast.success('Update avatar successfully!');
      setIsLoading(false);
    })
      .catch((err) => {
        console.log(err);
        toast.error('Update avatar failed!');
        setIsLoading(false);
      })
  };

  const onSubmitProfileDetails: SubmitHandler<ProfileDetails> = (data) => {
    setIsLoading(true);
    axios.put<any>(API_SERVER + "/accounts/" + auth.user.accountId, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then(() => {
      auth.setUser({
        ...auth.user,
        ...data
      });
      toast.success('Update details successfully!');
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      toast.error('Update details failed!');
      setIsLoading(false);
    })
  };

  const onSubmitTwoFactorAuth: SubmitHandler<TwoFactorAuth> = (data) => {
    if (data.enable2fa === auth.user.require2fa) {
      toast.warning("Settings stay unchanged!");
      return;
    }
    setIsLoading(true);
    axios.post<any>(API_SERVER + "/accounts/change-2fa/" + auth.user.accountId, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth.user.accessToken,
      },
    }).then(() => {
      toast.success('Changed 2FA settings successfully!');
      setIsLoading(false);
      resetTwoFactorAuthForm({
        enable2fa: data.enable2fa,
        currentPassword: ""
      });
    }).catch((err) => {
      console.log(err);
      toast.error('Changed 2FA settings failed!');
      setIsLoading(false);
      resetTwoFactorAuthForm({
        enable2fa: auth.user.require2fa,
        currentPassword: ""
      });
    })
  };

  return (
    <>
      <div className="flex flex-col gap-12">
        <Card>
          <form
            onSubmit={handleProfileAvatarForm(onSubmitProfileAvatar)}>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>
                Update your avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="inline-block relative">
                <Avatar className="w-[80px] h-[80px]">
                  <div className="absolute inset-0 bg-black translate-y-12 bg-opacity-50 " >
                    <CameraIcon className="w-6 h-6 m-auto text-white" />

                  </div>
                  <AvatarImage src={avatarPreview} alt="avatar" />
                  <AvatarFallback>{auth.user.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  {...profileAvatarForm("files")}
                  onChange={handleAvatarChange}
                  required
                  className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                {isLoading
                  ?
                  <Button disabled >
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                  : <Button
                    type="submit"
                  >Save avatar</Button>}
              </div>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <form
            onSubmit={handleProfileDetailForm(onSubmitProfileDetails)}>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                View and manage your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    type="text"
                    {...profileDetailForm("nickname")}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="phone"
                    {...profileDetailForm("phone")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                {isLoading
                  ?
                  <Button disabled >
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                  : <Button
                    type="submit"
                  >Save details</Button>}
              </div>
            </CardFooter>
          </form>
        </Card>


        {/* insert change password below here */}
        <ChangePassword isLoading={isLoading} setIsLoading={setIsLoading} />

        <Card>
          <form
            onSubmit={handleTwoFactorAuthForm(onSubmitTwoFactorAuth)}>
            <CardHeader>
              <CardTitle>Two-factor Authentication</CardTitle>
              <CardDescription>
                Enable or disable two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Controller
                    control={controlTwoFactorAuth}
                    name="enable2fa"
                    render={({ field }) => (
                      <Checkbox
                        id="enable2fa"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="enable2fa">Enable two-factor authentication</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password2fa">Current password</Label>
                  <Input
                    id="password2fa"
                    type="password"
                    {...twoFactorAuthForm("currentPassword")}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                {isLoading
                  ?
                  <Button disabled >
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                  : <Button
                    type="submit"
                  >Save</Button>}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>


    </>

  );
};
export default ProfileDetail;
