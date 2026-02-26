import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../../store/user.store';
import { assertAuthenticated } from '../../../shared/user.guard';
import { StartPageFormData, startPageSchema } from '../types';
import { startTransaction } from '../start-transaction.firebase';

export function useStartForm() {
  const user = userStore((state) => state.user);
  const setUserData = userStore(state => state.setUserData);
  const addWeight = userStore(state => state.addWeight);
  const navigate = useNavigate();

  const formMethods = useForm<StartPageFormData>({
    resolver: zodResolver(startPageSchema)
  });

  const onSubmit = async (data: StartPageFormData) => {
    assertAuthenticated(navigate, user);
    const mappedData = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString()
    };
    try {
      const weightId = await startTransaction(user.uid, mappedData);
      if (!weightId) return;
      addWeight({ id: weightId, weight: mappedData.weight, createdAt: new Date() });
      setUserData(mappedData);
      navigate('/dashboard/', { replace: true });
    } catch (e) {
      console.error(e);
      alert('something went wrong');
    }
  };

  return {
    formMethods,
    onSubmit
  };
}
