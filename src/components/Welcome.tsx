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
      <div className="flex flex-col items-center gap-4 py-64">
        <div className="py-16">{loadingText}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-6 py-64">
      {drawInProgress ? (
        <p>
          {drawingUser
            ? `${drawingUser} właśnie losuje, poczekaj na swoją kolej`
            : ''}
        </p>
      ) : (
        <>
          <button
            className="py-2 px-6 rounded-full bg-balls-4 text-sm font-mono font-extrabold tracking-wider text-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
          >
            Zacznij tutaj
          </button>
          {dropdownOpen && <p>Wybierz swoje imię</p>}
          <ul
            className={`mt-2 max-w-screen-lg border-balls-4 bg-gray-100 text-balls-4 rounded-lg  mx-auto shadow-md  ${
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
        </>
      )}
    </div>
  );
};
