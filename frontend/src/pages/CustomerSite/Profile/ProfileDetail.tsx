import React, { useEffect, useState } from "react";
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
import { fetchAccountById } from "@/services/AccountsServices";
import { get } from "http";
import { getCookie } from "@/utils/cookies";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileData {
  id: number;
  accessToken: string;
  username: string;
  role: string;
  refreshToken: string | null;
  email: string;
  phone: string | null;
  nickname: string | null;
  avatar: string | null;
  address: string | null;
}



const ProfileDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({} as ProfileData);
  const nav = useNavigate();
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const accountId = JSON.parse(getCookie("user"));

    if (!accountId) {
      nav("/auth/login");

    } else {
      fetchAccountById(accountId.id)
        .then((response) => {
          if (response && response.data) {
            setFormData(response.data);
          } else {
            console.error('No data found');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              Update your avatar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-start gap-4">
              <Avatar className="w-[80px] h-[80px]">
                <AvatarImage src={formData.avatar ? formData.avatar.link : '/placeholder.svg'} alt="Avatar" />
                <AvatarFallback>
                  <Car />
                </AvatarFallback>
              </Avatar>
              <Button>Change Avatar</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              View and manage your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <Label>Username</Label>
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={!isEditing}
            />

            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
            />

            <Label>Phone</Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
            />

            <Label>Nickname</Label>
            <Input
              value={formData.nickname || ""}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              disabled={!isEditing}
            />

            <Label>Address</Label>
            <Input
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!isEditing}
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>Save</Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </CardFooter>
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
            <Input type="password" />

            <Label>New Password</Label>
            <Input type="password" />

            <Label>Confirm Password</Label>
            <Input type="password" />
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
              <input type="checkbox" />
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
            <Input type="password" placeholder="Enter your password to confirm deletion" />
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
