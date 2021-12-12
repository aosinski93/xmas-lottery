import React from 'react';
import { useAtom } from 'jotai';
import { dataAtom, stepAtom, userAtom } from '../atoms';
import { User } from '../types/Users';

interface Props {}

export const Welcome = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [, setStep] = useAtom(stepAtom);
  const [data] = useAtom(dataAtom);
  const [user, setUser] = useAtom(userAtom);

  const handleSetUser = async (user: User) => {
    setUser(user);
    setDropdownOpen(false);
  };
  return (
    <div className="flex flex-col py-5 max-w-xl mx-auto">
      <button
        className="mx-auto py-3 bg-gray-500 rounded-lg"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Imię
      </button>

      <ul
        className={`mt-2  border-gray-400 bg-gray-100 rounded-lg max-w-6xl  mx-auto shadow-md ${
          dropdownOpen ? 'h-auto border' : 'h-0 overflow-hidden'
        }`}
      >
        {data
          .filter((user) => !user.already_drew)
          .map((user) => (
            <li
              key={user.id}
              onClick={() => handleSetUser(user)}
              className="hover:bg-gray-400 cursor-pointer m-2 py-1 rounded-lg"
            >
              {user.first_name}
            </li>
          ))}
      </ul>

      {user?.first_name ? <p>{`Hej ${user.first_name}`}</p> : null}
    </div>
  );
};
