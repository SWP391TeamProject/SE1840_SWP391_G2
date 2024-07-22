import React, { useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ImageGallery({ ...props }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const zoomRef = useRef(null);
  const toggleOpen = (state: boolean) => () => setOpen(state);
  const nav = useNavigate();

  const updateIndex = ({ index: current }: { index: number }) => setIndex(current);

  return (
    <>
      <div className="hover:cursor-pointer mb-3">
        <Lightbox
          index={index}
          slides={props.itemDTO?.attachments.map((image) => ({
            src: image.link,
            caption: props.itemDTO?.name,
            download: `${image.link}?download`,
          }))}
          plugins={[Inline, Thumbnails]}
          on={{
            view: updateIndex,
            click: toggleOpen(true),
          }}
          carousel={{
            padding: 0,
            spacing: 0,
            imageFit: 'cover',
          }}
          thumbnails={{
            position: 'start',
            border: 1,
            width: 100,
            height: 100,
          }}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
            iconZoomIn: () => null,
            iconZoomOut: () => null,
          }}
          inline={{
            style: {
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '3 / 2',
              margin: '0 auto',
            },
          }}
          styles={{
            container: { backgroundColor: 'transparent' },
            thumbnailsContainer: { backgroundColor: 'transparent' },
            thumbnailsTrack: { backgroundColor: 'transparent' },
          }}
        />

        <Lightbox
          open={open}
          close={toggleOpen(false)}
          index={index}
          plugins={[Zoom, Download, Thumbnails]}
          zoom={{
            ref: zoomRef,
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 1.5,
            doubleClickDelay: 300,
            doubleTapDelay: 300,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 120,
          }}
          slides={props.itemDTO?.attachments.map((image) => ({
            src: image.link,
            caption: props.itemDTO?.name,
            download: `${image.link}?download`,
          }))}
          on={{ view: updateIndex }}
          animation={{ fade: 0 }}
          controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
          styles={{
            container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
            thumbnailsContainer: { backgroundColor: 'rgba(0, 0, 0, 0.9)', border: 'none' },
            thumbnailsTrack: { opacity: '100' },
          }}
        />

      </div>
      <Button variant='default' className='w-full' onClick={() => nav(`/item/${props.itemDTO?.itemId}`)}>
        More Detail
      </Button>
    </>
  );
}
