import { Input } from '../../design/input';
import { Card } from '../../design/Card';

export function CheckInPage() {
  return (
    <div>
      <h1 className="text-center">Check-in</h1>
      <form className="mt-4">
        <Card className="mb-2">
          <Input label="Kilograme: "></Input>
        </Card>
        <Card className="mb-2">
          <Input label="Masuraturi bust: " type="number"></Input>
          <Input label="Masuraturi talie: " type="number"></Input>
          <Input label="Masuraturi solduri: " type="number"></Input>
          <Input label="Masuraturi fund: " type="number"></Input>
          <Input label="Masuraturi coapsa stanga: " type="number"></Input>
          <Input label="Masuraturi coapsa dreapta: " type="number"></Input>
          <Input label="Masuraturi bratul stang: " type="number"></Input>
          <Input label="Masuraturi bratul drept: " type="number"></Input>
        </Card>

        <Card>
          <Input label="Cate ore ai dormit in medie? " type="number"></Input>
          <Input label="Pe o scara de la 1 la 10 cat de bine ai respectat planul alimentar?" type="number" min="0" max="10"></Input>
          <Input label="Pe o scara de la 1 la 10 ce energie ai?" type="number" min="0" max="10"></Input>
          <Input label="Pe o scara de la 1 la 10 cum te simti (mood check)?" type="number" min="0" max="10"></Input>
          <Input label="Cati pasi ai facut zilnic in medie?" type="number" min="0" max="10"></Input>
        </Card>
        <button className="w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900">
          Check-in
        </button>
      </form>
    </div>
  );
}
