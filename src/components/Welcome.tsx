import { useWelcomeStep } from '../hooks/use-welcome-step';

export const Welcome = () => {
  const {
    users,
    loading,
    loadingText,
    drawInProgress,
    drawingUser,
    dropdownOpen,
    toggleDropdown,
    handleSetUser,
    hasUsersWithoutGiftSuggestions,
  } = useWelcomeStep();

  const usersOptions = users.filter((user) => !user.already_drew);
  const drawUnavailable = usersOptions.length === 0;

  const noGiftSuggestionsWarningText = `Niektórzy użytkownicy nie dodali jeszcze propozycji prezentów.`;

  if (loading) {
    return (
      <div className="flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6">
        <div className="py-16" role="status">
          {loadingText}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6">
      {hasUsersWithoutGiftSuggestions && (
        <p className="z-10 text-sm text-black-600">
          {noGiftSuggestionsWarningText}
        </p>
      )}
      {drawInProgress ? (
        drawingUser && (
          <p className="z-10">{`${drawingUser} właśnie losuje, poczekaj na swoją kolej`}</p>
        )
      ) : (
        <button
          type="button"
          className="py-2 px-6 rounded-full uppercase bg-santa-red-darker text-sm font-extrabold tracking-wider text-white z-10"
          onClick={toggleDropdown}
          disabled={drawUnavailable}
          aria-expanded={dropdownOpen}
          aria-controls="users-list"
        >
          {drawUnavailable
            ? 'Wszyscy użytkownicy już losowali'
            : 'Wybierz swoje imię z listy'}
        </button>
      )}

      {!drawInProgress && (
        <ul
          id="users-list"
          aria-label="Użytkownicy"
          hidden={!dropdownOpen}
          className={`mt-2 w-64 border-santa-red-darker  bg-gray-100 rounded-lg max-w-6xl mx-auto shadow-md z-10 ${
            dropdownOpen
              ? 'h-full max-h-96 overflow-y-auto border'
              : 'h-0 overflow-hidden'
          }`}
        >
          {usersOptions.map((user) => (
            <li key={user.id} className="m-4">
              <button
                type="button"
                onClick={() => handleSetUser(user)}
                className="w-full py-1 rounded-lg text-black-enough hover:bg-gray-400 focus-visible:bg-gray-400"
              >
                {user.first_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
