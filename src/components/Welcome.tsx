import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { dataAtom, stepAtom, userAtom } from '../atoms';
import { User } from '../types/Users';
import { supabase } from '../services/supabase';
import useSetDrawInProgress from '../services/hooks/useSetDrawInProgress';
import { Utils } from '../types/Utils';

interface Props {}

export const Welcome = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [, setStep] = useAtom(stepAtom);
  const [data] = useAtom(dataAtom);
  const [currentUser, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [drawInProgress, setDrawInProgress] = React.useState(true);
  const [drawingUser, setDrawingUser] = useState<string | null>(null);

  const { setDrawInProgressTrue: updateUtilsTable } = useSetDrawInProgress();

  const fetchUtils = useCallback(async () => {
    const { data } = await supabase.from<Utils>('utils').select('*');
    if (data?.length) {
      setDrawInProgress(data[0].draw_in_progress);
      setDrawingUser(data[0].user_drawing);
    }
  }, []);

  useEffect(() => {
    fetchUtils();

    const mySubscription = supabase
      .from('utils')
      .on('*', (payload) => {
        console.log(payload);
        setDrawInProgress(payload.new.draw_in_progress);
        setDrawingUser(payload.new.user_drawing);
      })
      .subscribe();

    return () => {
      mySubscription.unsubscribe();
    };
  }, [fetchUtils]);

  const handleSetUser = async (user: User) => {
    const timeout = Math.random() * 5000 + 1;
    console.log(`Waiting ${timeout}ms`);
    setLoading(true);
    setUser(user);
    setTimeout(() => {
      setDropdownOpen(false);
      updateUtilsTable(user.first_name);
      setStep(2);
      setLoading(false);
    }, timeout);
  };
  const isFemale = useMemo(() => {
    return (
      currentUser?.first_name.charAt(currentUser.first_name.length - 1) === 'a'
    );
  }, [currentUser]);
  const loadingText = `Poczekaj, sprawdzamy czy ${
    isFemale ? 'byłaś' : 'byłeś'
  } ${isFemale ? 'grzeczna' : 'grzeczny'}...`;

  if (loading) {
    return (
      <div className="flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6">
        <div className="py-16">{loadingText}</div>
      </div>
    );
  }

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
        <li className="hover:bg-gray-400 text-santa-red-darker cursor-pointer m-2 py-2 rounded-lg">
          {' '}
          Wybierz swoje imię{' '}
        </li>
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
      <img
        src="/images/santa-trees.png"
        alt=""
        className="fixed bottom-0 lg:max-w-lg"
      />
    </div>
  );
};
