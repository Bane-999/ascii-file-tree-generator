import {Seo} from '../components/seo/Seo';
import {TreeGeneratorWorkspace} from '../features/tree-generator/components/TreeGeneratorWorkspace';
import {AppLayout} from '../layouts/AppLayout';

export function HomePage() {
  return (
    <>
      <Seo />
      <AppLayout>
        <TreeGeneratorWorkspace />
      </AppLayout>
    </>
  );
}
