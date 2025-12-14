import { UserDetailDialog } from "@/entities/user";

import { useSelectedUser, useUserDetailDialog } from "../model/user-detail-modal.hook";

export function UserDetailDialogContainer() {
  const [user] = useSelectedUser();
  const [isOpen, setIsOpen] = useUserDetailDialog();

  return <UserDetailDialog open={isOpen} onOpenChange={setIsOpen} user={user} />;
}
