import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import { Badge, Button } from 'ui'
import DefaultLayout from '~/components/Layouts/Default'
import ShareArticleActions from '~/components/Blog/ShareArticleActions'
import SectionContainer from '~/components/Layouts/SectionContainer'
import CTABanner from '~/components/CTABanner'
import PrevNextFeatureNav from '~/components/PrevNextFeatureNav'

import { features } from '~/data/features'
import type { FeatureType } from '~/data/features'

interface FeaturePageProps {
  feature: FeatureType
  prevFeature: FeatureType | null
  nextFeature: FeatureType | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths based on each feature's slug
  const paths = features.map((feature) => ({
    params: { slug: feature.slug },
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }
  const featureIndex = features.findIndex((feature) => feature.slug === slug)

  if (featureIndex === -1) {
    return { notFound: true }
  }

  const feature = features[featureIndex]
  const prevFeature = featureIndex > 0 ? features[featureIndex - 1] : features[features.length - 1]
  const nextFeature = featureIndex < features.length - 1 ? features[featureIndex + 1] : features[0]

  // Destructure the icon property out, and add the icon name to props instead
  const { icon, ...featureWithoutIcon } = feature
  const { icon: _prevIcon, ...prevFeatureWithoutIcon } = prevFeature
  const { icon: _nextIcon, ...nextFeatureWithoutIcon } = nextFeature

  return {
    props: {
      feature: featureWithoutIcon,
      prevFeature: prevFeatureWithoutIcon,
      nextFeature: nextFeatureWithoutIcon,
    },
  }
}

const FeaturePage: React.FC<FeaturePageProps> = ({ feature, prevFeature, nextFeature }) => {
  const meta = {
    title: `${feature.title} | Supabase Features`,
    description: feature.subtitle,
    url: `https://supabase.com/features/${feature.slug}`,
    // image: ogImageUrl,
  }

  const Icon = features.find((f) => f.slug === feature.slug)?.icon as LucideIcon

  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.description}
        openGraph={{
          title: meta.title,
          description: meta.description,
          url: meta.url,
          type: 'article',
          // images: [
          //   {
          //     url: meta.image,
          //     alt: `${feature.title} thumbnail`,
          //     width: 1200,
          //     height: 627,
          //   },
          // ],
        }}
      />
      <DefaultLayout className="bg-alternative">
        <div className="relative flex flex-col w-full h-full">
          <PrevNextFeatureNav
            currentFeature={feature}
            prevLink={`/features/${prevFeature?.slug}`}
            nextLink={`/features/${nextFeature?.slug}`}
          />
          <header className="relative w-full overflow-hidden">
            <SectionContainer
              className="
                relative
                lg:min-h-[400px] h-full
                flex flex-col
                gap-4 md:gap-8
                text-foreground-light
                !py-10
              "
            >
              <div className="relative h-full flex flex-col items-start gap-2 w-full max-w-2xl mx-auto">
                <div className="flex gap-1 flex-wrap mb-2">
                  {feature.products.map((product) => (
                    <Badge key={product} className="capitalize" size="small">
                      {product}
                    </Badge>
                  ))}
                </div>
                <h1 className="h1 !m-0">{feature.title}</h1>
                <p>{feature.subtitle}</p>
              </div>
              <div
                className="
                  relative w-full aspect-video bg-surface-100 overflow-hidden
                  border shadow-lg rounded-lg
                  mx-auto max-w-2xl
                  flex items-center justify-center
                "
              >
                {!!feature.heroImage ? (
                  <Image
                    src={feature.heroImage}
                    fill
                    sizes="100%"
                    quality={100}
                    alt={`${feature.title} thumbnail`}
                    className="absolute inset-0 object-cover object-center"
                  />
                ) : (
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
                )}
              </div>
            </SectionContainer>
          </header>
          <SectionContainer className="!pt-0">
            <main className="max-w-xl mx-auto flex flex-col items-start gap-4">
              <div className="prose prose-docs">
                <ReactMarkdown>{feature.description}</ReactMarkdown>
              </div>
              {feature.docsUrl && (
                <Button type="default" iconRight={<ChevronRight />} asChild>
                  <Link href={feature.docsUrl}>Read Documentation</Link>
                </Button>
              )}
              <div className="w-full flex items-center justify-between text-foreground-lighter text-sm border-y py-4 mt-4 lg:mt-8">
                <span>Share</span>
                <ShareArticleActions
                  title={meta.title}
                  slug={meta.url}
                  basePath=""
                  iconSize={18}
                  className="m-0"
                />
              </div>
              <div className="w-full flex justify-between gap-8 mt-8 text-sm text-foreground-light">
                {prevFeature && (
                  <Link
                    href={`/features/${prevFeature.slug}`}
                    className="w-1/2 flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="truncate">{prevFeature.title}</span>
                  </Link>
                )}
                {nextFeature && (
                  <Link
                    href={`/features/${nextFeature.slug}`}
                    className="w-1/2 flex items-center justify-end gap-1 transition-colors hover:text-foreground text-right"
                  >
                    <span className="truncate">{nextFeature.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </main>
          </SectionContainer>
        </div>
        <CTABanner />
      </DefaultLayout>
    </>
  )
}

export default FeaturePage
