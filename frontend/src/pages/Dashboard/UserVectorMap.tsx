import React from 'react'
import {VectorMap} from 'react-jvectormap';


export default function UserVectorMap() {
    const mapData = {
        US: 298,
        CA: 123,
        FR: 45,
        DE: 67,
        RU: 234,
        CN: 300,
        IN: 200,
      };
    
      return (
        <div style={{ width: '600px', height: '400px' }}>
          <VectorMap
            map={'vietnam'}
            backgroundColor="#FFFFFF"
            zoomOnScroll={false}
            containerStyle={{
              width: '100%',
              height: '100%',
            }}
            regionStyle={{
              initial: {
                fill: '#E3E3E3',
                'fill-opacity': 1,
                stroke: 'none',
                'stroke-width': 0,
                'stroke-opacity': 1,
              },
              hover: {
                'fill-opacity': 0.8,
                cursor: 'pointer',
              },
              selected: {
                fill: '#F4A582',
              },
              selectedHover: {},
            }}
            series={{
              regions: [
                {
                  values: mapData,
                  scale: ['#C8EEFF', '#0071A4'],
                  normalizeFunction: 'polynomial',
                },
              ],
            }}
            onRegionTipShow={(e, el, code) => {
              let content = "State: " + el.html()
              + "<br/>Count: "
            return el.html(content)
            }}
          />
        </div>
      );
}
