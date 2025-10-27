interface GroupInterface {
  id: number;
  name: string;
  students?: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    groupId: number;
  }[];
}

export default GroupInterface;
