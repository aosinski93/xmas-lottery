import { type FormEvent, useState } from 'react';
import { useAtom } from 'jotai';
import { stepAtom, StepName, userAtom } from '../atoms';
import { useLotteryData } from '../contexts/lottery-data-context';

export const GiftEntry = () => {
  const [user, setUser] = useAtom(userAtom);
  const [, setStep] = useAtom(stepAtom);
  const { updateUser } = useLotteryData();
  const [suggestions, setSuggestions] = useState(
    user?.gift_suggestions?.join('\n') ?? '',
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setStep(StepName.welcome);
      return;
    }

    const giftSuggestions = suggestions
      .split('\n')
      .map((suggestion) => suggestion.trim())
      .filter(Boolean);

    if (giftSuggestions.length === 0) {
      setError('Dodaj przynajmniej jedną propozycję prezentu.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await updateUser(user.id, { gift_suggestions: giftSuggestions });
      setUser({ ...user, gift_suggestions: giftSuggestions });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Nie udało się zapisać propozycji. Spróbuj ponownie.',
      );
      setSaving(false);
    } finally {
      setSaving(false);
      setStep(StepName.welcome);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-auto items-center justify-center bg-background-color-snow px-4 py-6">
        <div className="z-10 rounded-3xl border-2 border-santa-red-light bg-white p-6 shadow-lg">
          <p>Najpierw wybierz swoje imię z listy.</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-santa-red-darker px-6 py-2 font-bold text-white"
            onClick={() => setStep(StepName.welcome)}
          >
            Wróć do listy
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-auto items-start justify-center bg-background-color-snow px-4 py-6">
      <section
        aria-labelledby="gift-entry-title"
        className="z-10 w-full max-w-sm rounded-3xl border-2 border-santa-red-light bg-white p-6 text-left shadow-lg"
      >
        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-santa-red-darker">
          Twoja lista prezentów
        </p>
        <h1
          id="gift-entry-title"
          className="text-2xl font-extrabold text-black-enough"
        >
          Cześć, {user.first_name}!
        </h1>
        <p className="mt-2 text-sm leading-6 text-black-enough">
          Dodaj pomysły, które ułatwią wybór prezentu. Możesz nadpisać
          wcześniejsze propozycje.
        </p>

        <form className="mt-5" onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="gift-suggestions"
            className="mb-2 block text-sm font-bold text-black-enough"
          >
            Propozycje prezentowe
          </label>
          <textarea
            id="gift-suggestions"
            name="gift-suggestions"
            rows={5}
            required
            maxLength={500}
            value={suggestions}
            onChange={(event) => setSuggestions(event.target.value)}
            aria-describedby="gift-suggestions-help"
            aria-invalid={Boolean(error)}
            placeholder={'Książka\nCiepły szalik\nZabawka dla kota'}
            className="w-full resize-y rounded-2xl border-2 border-santa-blue bg-white px-4 py-3 text-black-enough outline-none focus:border-santa-red-darker focus:ring-2 focus:ring-santa-red-light"
          />
          <div
            id="gift-suggestions-help"
            className="mt-2 flex items-start justify-between gap-3 text-xs text-black-enough"
          >
            <span>Wpisz każdą propozycję w nowym wierszu.</span>
            <span className="shrink-0">{suggestions.length}/500</span>
          </div>

          {error && (
            <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full rounded-full bg-santa-red-darker px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? 'Zapisywanie...' : 'Zapisz i wyjdź'}
          </button>
        </form>
      </section>
    </main>
  );
};
