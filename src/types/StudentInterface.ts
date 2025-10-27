interface StudentInterface {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  groupId: number;
  uuid?: string;
  isDeleting?: boolean;
  group?: {
    id: number;
    name: string;
  };
}

export default StudentInterface;
