import { useWelcomeStep } from '../hooks/useWelcomeStep';

export const Welcome = () => {
  const {
    data,
    loading,
    loadingText,
    drawInProgress,
    drawingUser,
    dropdownOpen,
    toggleDropdown,
    handleSetUser,
  } = useWelcomeStep();

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
          className="py-2 px-6 rounded-full uppercase bg-santa-red-darker text-sm font-extrabold tracking-wider text-white z-10"
          onClick={toggleDropdown}
        >
          zacznij tutaj
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
