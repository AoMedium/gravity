import useOutputData from '../../hooks/use-output-data';

export default function InfoView() {
  const system = useOutputData<string>('updateSystem');
  const entities = useOutputData<number>('updateEntities');

  return (
    <div style={{ color: 'white' }}>
      <div>System: {system}</div>
      <div>Entities: {entities}</div>
    </div>
  );
}
