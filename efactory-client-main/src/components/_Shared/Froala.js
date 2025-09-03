import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import config from '../../util/config'
import 'froala-editor/js/froala_editor.pkgd.min.js'
import 'froala-editor/js/plugins/colors.min.js'
import 'froala-editor/js/plugins/table.min.js'
import 'froala-editor/js/plugins/fullscreen.min.js'
import 'froala-editor/js/plugins/paragraph_style.min.js'
import FroalaEditor from './react-froala-wysiwyg'
import { getThemeData } from '../../util/storageHelperFuncs'

const Froala = props => {
  const froala = useRef(null)
  const [froalaConfig, setFroalaConfig] = useState()
  const [didMount, setDidMount] = useState(false)
  
  useEffect(
    () => {
      let { config : configReceived } = props
      configReceived = configReceived || {}
      let themeNext = getThemeData()
      let froalaConfigNext = {
        placeholderText: configReceived.placeholderText || 'Edit Your Email Template Here!',
        imageUploadURL: `${config.host}/api/ImageUpload/Upload`,
        imageOutputSize: true, // add size attributes
        //imageResize: false,
        //imageDefaultWidth: 0,
        charCounterCount: false,
        heightMin: 260,
        heightMax: 410,
        id : '#hey',
        //key: 'MiikbD-8udA2pvztwkjI2C-21rs==',
        //key: '0G4D4E3B11dD5B4E4G5H3I3I3B7D5E4F-11aacjgmA-16C6hnblC-7cbA1wzF-10==', /// demo site
        key: 'aD3B2B7C8bA4B3E2C1I3H2A5C6B3E4uommnzd1bhB1wwyuxjiF3xsp==', /// efactory site
        pluginsEnabled: ['fullscreen','align','fontFamily','fontSize','lists','image', 'link', 'table','paragraphStyle'],
        fontFamily: {
          "Arial, Helvetica, sans-serif": "Arial",
          "Georgia,serif": "Georgia",
          "Impact,Charcoal,sans-serif": "Impact",
          "'Courier New', Courier, monospace": 'Monospace',
          "Tahoma,Geneva,sans-serif": "Thanoma",
          "'Times New Roman',Times,serif": "Times New Roman",
          "Verdana,Geneva,sans-serif": "Verdana"
        },
        fontSize: ['8','9','10','11','12','13','14','16','18','22','30', '60', '96'],
        /*paragraphStyles: {
          fr_monospace: 'Monospace'
        },*/
        tableCellStyles: {
          fr_row_title: 'Title Cell',
          fr_row_title_2: 'Title Cell (no border)',
          fr_row_product: 'Order Line Cell',
          fr_row_generic: 'Generic Cell'
        },
        theme: themeNext === 'default' ? 'dark' : undefined,
        tableStyles: {
          fr_tb_33: 'Table 33% width',
          fr_tb_50: 'Table 50% width',
          fr_tb_66: 'Table 66% width',
          fr_tb_75: 'Table 75% width',
          fr_tb_600: 'Table 600px width',
          fr_tb_800: 'Table 800px width',
          fr_tb_minimum: 'Table narrow',
        },
        tableMultipleStyles: false,
        tableCellMultipleStyles: false,
        tableInsertHelper: false,
        tableEditButtons: ['tableRows', 'tableColumns', 'tableCellStyle', 'tableStyle', '-',
                           'tableCellVerticalAlign', 'tableCellHorizontalAlign', 'tableCells', 'tableCellBackground', '|','tableRemove'  ],
        //useClasses: false,
        toolbarButtons: ['fullscreen', '|', 'bold', 'italic', 'underline','fontFamily', 'fontSize','|','align', 'formatOL', 'formatUL', 'outdent', 'indent','|','insertLink','insertImage','insertTable','|','undo', 'redo'],
        ...configReceived
      }
      setDidMount(true)
      setFroalaConfig(froalaConfigNext)

      global.document.addEventListener('themeChange', onThemeChanged, false)
      return () => {
        global.document.removeEventListener('themeChange', onThemeChanged, false)
      }
    },
    []
  )

  function handleEditorChange (value) {
    props.onChangeHandler(value)
  }

  function onThemeChanged (storage) {
    let theme = getThemeData() === 'default' ? 'dark' : undefined
    setFroalaConfig({ ...froalaConfig, theme })
  }

  if( !didMount ) return <span></span>
  let { value = '' } = props
  return (
    <FroalaEditor
      tag='textarea'
      ref={froala}
      config={froalaConfig}
      model={value}
      onModelChange={handleEditorChange}
    />
  )
} 

Froala.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  config: PropTypes.object
}

export default Froala