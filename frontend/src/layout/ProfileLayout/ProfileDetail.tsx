import React, { useState } from "react";
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

interface ProfileDetailProps {
  profileData: ProfileData;
  onUpdateProfile: (updatedData: Partial<ProfileData>) => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  profileData,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          View and manage your personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.keys(profileData).map((field) => {
          if (
            field === "id" ||
            field === "accessToken" ||
            field === "refreshToken" ||
            field === "role"
          )
            return null;
          const value = profileData[field as keyof ProfileData];
          return (
            <div key={field} className="flex flex-col">
              <Label htmlFor={field} className="font-semibold">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Label>
              {isEditing ? (
                <Input
                  id={field}
                  value={formData[field as keyof ProfileData] || value || ""}
                  onChange={(e) =>
                    handleInputChange(field as keyof ProfileData, e.target.value)
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {value || "Not provided"}
                </p>
              )}
            </div>
          );
        })}
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
  );
};

export default ProfileDetail;
