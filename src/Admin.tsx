import { useEffect, useState } from 'react';

import {
  resetUsersTable,
  resetUtilsTable,
  supabase,
} from './services/supabase';
import { User } from './types/database.types';
import { Utils } from './types/Utils';
import { Family } from './types/Family';

const tabs = [
  { key: 'users', label: 'Użytkownicy' },
  { key: 'utils', label: 'Narzędzia' },
];

const fetchAllUsers = async (): Promise<User[]> =>
  supabase
    .from<User>('users')
    .select('*')
    .order('updated_at', { ascending: false })
    .then(({ data }) => data || []);

const fetchUtilsData = async (): Promise<any> =>
  supabase
    .from<Utils>('utils')
    .select('*')
    .then(({ data }) => data || []);

const fetchFamilies = async (): Promise<Family[]> =>
  supabase
    .from<Family>('families')
    .select('*')
    .then(({ data }) => data || []);

const EditUserModal = ({
  user,
  closeModal,
}: {
  user: User;
  closeModal: () => void;
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    if (!user.id) {
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);

    const suggestions = formData
      .getAll('suggestion')
      .filter(Boolean) as string[];
    const name = formData.get('first_name') as string;
    e.preventDefault();
    // Logic to add gift suggestion for userId
    try {
      await supabase
        .from<User>('users')
        .update({
          gift_suggestions: suggestions,
          ...(name && { first_name: name }),
        })
        .eq('id', user.id);

      closeModal();
    } catch (error) {
      console.error('Error adding gift suggestion:', error);
    }
  };

  return (
    <div className="p-4 border rounded drop-shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">
        Dodaj propozycje prezentów
      </h2>
      <form className="flex flex-col" onSubmit={onSubmit} autoComplete="off">
        <label htmlFor="first_name" className="self-start">
          Imię użytkownika:
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Imię użytkownika"
          className="border p-2 rounded"
          defaultValue={user.first_name}
        />

        <label htmlFor="suggestion1" className="self-start mt-16">
          Propozycje prezentów:
        </label>
        <div className="flex flex-col space-y-2 mb-4">
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={index}
              id={`suggestion${index + 1}`}
              name="suggestion"
              type="text"
              placeholder={`Propozycja ${index + 1}`}
              className="border p-2 rounded"
              defaultValue={user.gift_suggestions?.[index] || ''}
            />
          ))}
        </div>
        <div className="flex space-x-4 justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={closeModal}
          >
            Zamknij
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Admin() {
  const [tab, setTab] = useState<'users' | 'utils'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [utils, setUtils] = useState<Utils[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);

  useEffect(() => {
    fetchAllUsers().then(setUsers).catch(console.error);
    fetchUtilsData().then(setUtils).catch(console.error);
    fetchFamilies().then(setFamilies).catch(console.error);

    supabase
      .from<User>('users')
      .on('*', () => {
        fetchAllUsers().then(setUsers).catch(console.error);
      })
      .subscribe();

    supabase
      .from<Utils>('utils')
      .on('*', () => {
        fetchUtilsData().then(setUtils).catch(console.error);
      })
      .subscribe();

    supabase
      .from<Family>('families')
      .on('*', () => {
        fetchFamilies().then(setFamilies).catch(console.error);
      })
      .subscribe();
  }, []);

  return (
    <div className="flex flex-col text-center h-screen font-sans">
      <div className="flex pl-8 mt-6 space-x-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded ${
              tab === t.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setTab(t.key as 'users')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <UserList users={users} utils={utils} families={families} />
      )}
      {tab === 'utils' && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Narzędzia</h2>
          <p className="mb-4">zresetuj wszystkie statusy losowania</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={async () => {
              await resetUsersTable();
            }}
          >
            Zresetuj tabelę users
          </button>

          <div className="mt-8 flex flex-col space-y-4 w-64 mx-auto">
            <p>odblokuj losowanie</p>
            <button
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={async () => {
                const res = await resetUtilsTable(1);

                alert(res);
              }}
            >
              Zresetuj tabelę utils dla rodziny Liśkiewiczów
            </button>
            <button
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={async () => {
                const res = await resetUtilsTable(2);

                alert(res);
              }}
            >
              Zresetuj tabelę utils dla rodziny Osińskich
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type UserListItemProps = {
  user: User;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function UserListItem({
  user,
  setShowModal,
  setSelectedUser,
}: UserListItemProps) {
  const { id, first_name, draw_result, gift_suggestions } = user;
  return (
    <li
      key={id}
      className="border-b py-2 grid grid-cols-5 grid-rows-1 gap-4"
      data-id={id}
    >
      <div className="">{first_name}</div>
      <div className="">{(draw_result as User)?.first_name}</div>
      <div className="col-span-2 col-start-3">
        <ol className="list-decimal list-inside">
          {gift_suggestions?.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ol>
      </div>
      <div className="w-1/4">
        <button
          className="mt-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
          onClick={() => {
            setShowModal(true);
            setSelectedUser(user);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {/* pencil */}
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}

const positiveSpan = (text = 'tak') => (
  <span className="text-green-500">{text}</span>
);
const negativeSpan = (text = 'nie!') => (
  <span className="text-red-500">{text}</span>
);

function UserList({
  users,
  utils,
  families,
}: {
  users: User[];
  utils: Utils[];
  families: Family[];
}) {
  const [selectedFamily, setSelectedFamily] = useState<Family['id']>(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) => selectedFamily === 0 || user.family === selectedFamily
  );

  return (
    <>
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black ">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            <EditUserModal
              user={selectedUser}
              closeModal={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse md:flex-row">
        <div className="mt-8 px-4 w-full md:w-2/3">
          <div className="flex space-x-4 mb-12 ml-8">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="family"
                value="all"
                checked={selectedFamily === 0}
                onChange={() => setSelectedFamily(0)}
              />
              <span>Wszystkie rodziny</span>
            </label>
            {families.map((family) => (
              <label key={family.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="family"
                  value={family.id}
                  checked={selectedFamily === family.id}
                  onChange={() => setSelectedFamily(family.id)}
                />
                <span>{family.name}</span>
              </label>
            ))}
          </div>
          <ul className="mt-4">
            <div className="grid grid-cols-5 grid-rows-1 gap-4 font-bold border-b pb-2 mb-2">
              <div className="font-bold">Imię</div>
              <div className="font-bold">Wynik</div>
              <div className="font-bold col-span-2 col-start-3">
                Propozycje prezentów
              </div>
              <div className="font-bold" />
            </div>

            {filteredUsers.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                setShowModal={setShowModal}
                setSelectedUser={setSelectedUser}
              />
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/2 mt-8 md:mt-0 px-4">
          <h2 className="text-2xl font-semibold mb-4 mt-8 px-4">status:</h2>
          <div className="flex flex-col content-start space-y-4">
            <ul>
              <li className="border-b py-2 flex">
                <p>wszyscy uzytkownicy: {filteredUsers.length}</p>
              </li>
              <li className="border-b py-2 flex space-x-2">
                <p>
                  czy wszyscy mają przypisaną przynajmniej jedną propozycję
                  prezentu?
                </p>

                <p>
                  {filteredUsers.every(
                    (user) =>
                      user.gift_suggestions && user.gift_suggestions.length > 0
                  )
                    ? positiveSpan()
                    : negativeSpan()}
                </p>
              </li>
              <li className="border-b py-2 flex space-x-2">
                <p>czy wszyscy juz losowali?</p>

                {filteredUsers.every((user) => user.already_drew)
                  ? positiveSpan()
                  : negativeSpan()}
              </li>
              <li className="border-b py-2 flex space-x-2">
                <p>czy wszyscy zostali wylosowani?</p>
                <p>
                  {filteredUsers.every((user) => user.has_been_drawn)
                    ? positiveSpan()
                    : negativeSpan()}
                </p>
              </li>
              <li className="border-b py-2 flex space-x-2">
                <p>czy ktoś przypadkiem wylosował samego siebie?</p>
                <p>
                  {filteredUsers.some(
                    (user) => (user.draw_result as User)?.id === user.id
                  )
                    ? negativeSpan('tak!')
                    : positiveSpan('nie')}
                </p>
              </li>
              {selectedFamily === 2 && (
                <li className="border-b py-2 flex space-x-2">
                  <p>losowanie w rodzinie Osińskich skończyło się?</p>
                  <p className="font-bold">
                    {filteredUsers
                      .filter(
                        (u) =>
                          u.family ===
                          families.find((f) => f.name === 'Osińscy')?.id
                      )
                      .every((u) => u.has_been_drawn && u.already_drew)
                      ? positiveSpan()
                      : negativeSpan()}
                  </p>
                </li>
              )}

              {selectedFamily === 1 && (
                <li className="border-b py-2 flex space-x-2">
                  <p>losowanie w rodzinie Liśkiewiczów skończyło się?</p>
                  <p className="font-bold">
                    {filteredUsers
                      .filter(
                        (u) =>
                          u.family ===
                          families.find((f) => f.name === 'Liśkiewicze')?.id
                      )
                      .every((u) => u.has_been_drawn && u.already_drew)
                      ? 'tak'
                      : 'nie'}
                  </p>
                </li>
              )}

              {utils
                .filter((util) => util.family === selectedFamily)
                .map((util) => (
                  <li key={util.id} className="border-b py-2 flex">
                    <p className="font-bold">
                      {`w rodzinie ${
                        families.find((f) => f.id === util.family)?.name
                      }
                
                ${
                  util.draw_in_progress
                    ? `losuje - ${util.user_drawing}`
                    : '- nikt nie losuje'
                }`}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
