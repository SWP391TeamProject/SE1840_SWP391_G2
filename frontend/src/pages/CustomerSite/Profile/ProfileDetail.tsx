import {ChangeEvent, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Loader2} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/AuthProvider.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {API_SERVER} from "@/constants/domain.ts";
import {toast} from "react-toastify";
import axios from "axios";

type ProfileAvatar = {
  files?: FileList;
}

type ProfileDetails = {
  nickname: string;
  phone: string;
}

const ProfileDetail = () => {
  const auth = useAuth();
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(true);
    const formData = new FormData();
    formData.append("file", data.files[0]);
    axios.post<any>(API_SERVER + "/accounts/avatar/" + auth.user.accountId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Bearer " + auth.user.accessToken,
        },
      })
      .catch((err) => {
        console.log(err);
        toast.error('Update avatar failed!');
        setIsSaving(false);
      }).then((res) => {
        auth.setUser({
          ...auth.user,
          avatar: res.data
        });
        toast.success('Update avatar successfully!');
        setIsSaving(false);
    })
  };

  const onSubmitProfileDetails: SubmitHandler<ProfileDetails> = (data) => {
    setIsSaving(true);
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
                  <AvatarImage src={avatarPreview} alt="avatar"/>
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
                {isSaving
                  ?
                  <Button disabled className="bg-orange-600">
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"/>
                    Please wait
                  </Button>
                  : <Button
                    type="submit"
                    className="w-full bg-orange-600 rounded-xl text-white hover:bg-orange-700"
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
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                {isSaving
                  ?
                  <Button disabled className="bg-orange-600">
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"/>
                    Please wait
                  </Button>
                  : <Button
                    type="submit"
                    className="w-full bg-orange-600 rounded-xl text-white hover:bg-orange-700"
                  >Save details</Button>}
              </div>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Current Password</Label>
            <Input type="password"/>

            <Label>New Password</Label>
            <Input type="password"/>

            <Label>Confirm Password</Label>
            <Input type="password"/>
          </CardContent>
          <CardFooter>
            <Button>Change Password</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Two-factor Authentication</CardTitle>
            <CardDescription>
              Enable or disable two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Two-factor Authentication</Label>
            <div className="flex items-center gap-4">
              <input type="checkbox"/>
              <span>Enable two-factor authentication</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Confirm Deletion</Label>
            <Input type="password"
                   placeholder="Enter your password to confirm deletion"/>
          </CardContent>
          <CardFooter>
            <Button>Delete Account</Button>
          </CardFooter>
        </Card>
      </div>


    </>

  );
};
export default ProfileDetail;
