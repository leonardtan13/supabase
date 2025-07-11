import { useParams } from 'common'

import DefaultLayout from 'components/layouts/DefaultLayout'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import StorageBucketsError from 'components/layouts/StorageLayout/StorageBucketsError'
import StorageLayout from 'components/layouts/StorageLayout/StorageLayout'
import { StorageExplorer } from 'components/to-be-cleaned/Storage'
import { useSelectedBucket } from 'components/to-be-cleaned/Storage/StorageExplorer/useSelectedBucket'
import { useStorageExplorerStateSnapshot } from 'state/storage-explorer'
import type { NextPageWithLayout } from 'types'

const PageLayout: NextPageWithLayout = () => {
  const { bucketId } = useParams()
  const { project } = useProjectContext()
  const { projectRef } = useStorageExplorerStateSnapshot()
  const { bucket, error, isSuccess, isError } = useSelectedBucket()

  if (!project || !projectRef) return null

  return (
    <div className="storage-container flex flex-grow p-4">
      {isError && <StorageBucketsError error={error as any} />}

      {isSuccess ? (
        !bucket ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-foreground-light">Bucket {bucketId} cannot be found</p>
          </div>
        ) : (
          <StorageExplorer bucket={bucket} />
        )
      ) : (
        <div />
      )}
    </div>
  )
}

PageLayout.getLayout = (page) => (
  <DefaultLayout>
    <StorageLayout title="Buckets">{page}</StorageLayout>
  </DefaultLayout>
)

export default PageLayout
