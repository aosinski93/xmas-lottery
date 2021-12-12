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
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };
  return (
    <div className="flex flex-col items-center gap-4 bg-background-color-snow pt-6">
      <button
        className="py-2 px-6 rounded-full bg-balls-4 text-sm font-mono font-extrabold tracking-wider text-white"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        IMIĘ
      </button>

      <ul
        className={`mt-2  border-balls-4 bg-gray-100 text-balls-4 rounded-lg max-w-6xl  mx-auto shadow-md ${
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
