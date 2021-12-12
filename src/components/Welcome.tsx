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
    setStep(2);
  };
  return (
    <div className="flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6">
      <button
        className="py-2 px-6 rounded-full bg-santa-red-darker text-sm font-extrabold tracking-wider text-white"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        ZACZNIJ TUTAJ
      </button>

      <ul
        className={`mt-2 w-64 max-w-full border-santa-red-darker  bg-gray-100 rounded-lg max-w-6xl  mx-auto shadow-md z-10 ${
          dropdownOpen ? 'h-auto border' : 'h-0 overflow-hidden'
        }`}
      >
        <li className="hover:bg-gray-400 text-santa-red-darker cursor-pointer m-2 py-2 rounded-lg"> Wybierz swoje imię </li>
        {data
          .filter((user) => !user.already_drew)
          .map((user) => (
            <li
              key={user.id}
              onClick={() => handleSetUser(user)}
              className="hover:bg-gray-400 cursor-pointer m-2 py-1 rounded-lg text-black-enough "
            >
              {user.first_name}
            </li>
          ))}
      </ul>
      <img src="/images/santa-trees.png" alt="" className='fixed bottom-0' />
    </div>
  );
};
