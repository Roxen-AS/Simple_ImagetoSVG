import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import "/workspaces/Simple_ImagetoSVG/image-to-svg-converter/src/App.css"
 
function App() {
  const [imageFile, setImageFile] = useState(null);
  const [svgContent, setSvgContent] = useState('');
 
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setImageFile(file);
      convertImageToSvg(file);
    } else {
      alert('Please upload a valid PNG or JPEG image.');
    }
  };
 
  const convertImageToSvg = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas and draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
 
        // Get image data URL and embed in SVG format
        const dataUrl = canvas.toDataURL();
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${dataUrl}" width="${img.width}" height="${img.height}" />
          </svg>`;
        
        setSvgContent(svgString);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
 
  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
 
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
 
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Image to SVG Converter</h1>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select Image (PNG or JPEG)</Form.Label>
          <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} />
        </Form.Group>
        <Row>
          <Col>
            {imageFile && (
              <div className="mb-3">
                <h5>Original Image Preview:</h5>
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="img-fluid" />
              </div>
            )}
          </Col>
          <Col>
            {svgContent && (
              <div className="mb-3">
                <h5>SVG Preview:</h5>
                <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                <Button variant="primary" className="mt-3" onClick={downloadSvg}>
                  Download SVG
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
 
export default App;