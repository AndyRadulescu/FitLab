import { StartForm } from './components/start-form';
import { useStartForm } from './hooks/use-start-form';

export function StartPage() {
  const { formMethods, onSubmit } = useStartForm();

  return (
    <StartForm formMethods={formMethods} onSubmit={onSubmit} />
  );
}
