import useSubscription from '../../hooks/use-subscription';

export default function InfoView() {
  const system = useSubscription<string>('updateSystem');
  const entities = useSubscription<number>('updateEntities');

  return (
    <div style={{ color: 'white' }}>
      <div>System: {system}</div>
      <div>Entities: {entities}</div>
    </div>
  );
}
