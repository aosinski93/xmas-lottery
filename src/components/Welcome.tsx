import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { dataAtom, stepAtom, userAtom } from '../atoms';
import { User } from '../types/Users';
import { supabase } from '../services/supabase';
import useSetDrawInProgress from '../services/hooks/useSetDrawInProgress';
import { Utils } from '../types/Utils';

export const Welcome = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const setStep = useSetAtom(stepAtom);
  const data = useAtomValue(dataAtom);
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
    setLoading(true);
    setUser(user);
    setTimeout(async () => {
      await updateUtilsTable(user.first_name);
      setDropdownOpen(false);
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
      {drawInProgress ? (
        <>
          {drawingUser && (
            <p className="z-10">{`${drawingUser} właśnie losuje, poczekaj na swoją kolej`}</p>
          )}
        </>
      ) : (
        <button
          className="py-2 px-6 rounded-full bg-santa-red-darker text-sm font-extrabold tracking-wider text-white z-10"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          ZACZNIJ TUTAJ
        </button>
      )}

      {!drawInProgress && (
        <ul
          className={`mt-2 w-64 border-santa-red-darker  bg-gray-100 rounded-lg max-w-6xl  mx-auto shadow-md z-10 ${
            dropdownOpen ? 'h-auto border' : 'h-0 overflow-hidden'
          }`}
        >
          <li className="text-santa-red-darker m-2 py-2 rounded-lg">
            Wybierz swoje imię
          </li>
          {data
            .filter((user) => !user.already_drew)
            .map((user) => (
              <li
                key={user.id}
                onKeyDown={() => handleSetUser(user)}
                onClick={() => handleSetUser(user)}
                className="hover:bg-gray-400 cursor-pointer m-4 py-1 rounded-lg text-black-enough "
              >
                {user.first_name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
