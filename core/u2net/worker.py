import os
import torch
from torchvision import transforms
import numpy as np
from PIL import Image
from .data_loader import RescaleT
from .data_loader import ToTensorLab
from .model import U2NET
from skimage import io

class Process():
    def __init__(self) -> None:
        current_directory = os.path.dirname(os.path.abspath(__file__))
        saved_models_directory = os.path.join(current_directory, 'saved_models')
        model_dir = os.path.join(saved_models_directory, 'u2net_human_seg.pth')
        
        self.net = U2NET(3, 1)
        if torch.cuda.is_available():
            self.net.load_state_dict(torch.load(model_dir))
            self.net.cuda()
        else:
            self.net.load_state_dict(torch.load(model_dir, map_location='cpu'))
        self.net.eval()
        
       
    def normPRED(self,d):
        ma = torch.max(d)
        mi = torch.min(d)
        dn = (d-mi)/(ma-mi)
        return dn
    
    def save_output(self,image_name,pred,output_path,custom_bg):
        predict = pred
        predict = predict.squeeze()
        predict_np = predict.cpu().data.numpy()
        im = Image.fromarray(predict_np*255).convert('RGB')
        image = io.imread(image_name)
        imo = im.resize((image.shape[1],image.shape[0]),resample=Image.BILINEAR)
        original_image = Image.open(image_name).convert("RGB")
        mask = imo.convert("L")
        cutout = self.naive_cutout(original_image, mask,custom_bg) 
        cutout_rgb = cutout.convert('RGB')   
        cutout_rgb.save(output_path)
    
    def naive_cutout(self,img, mask,custom_bg):
        background = Image.open(custom_bg).convert("RGBA").resize(img.size, Image.LANCZOS)
        cutout = Image.composite(img, background, mask.resize(img.size, Image.LANCZOS))
        return cutout
    
    def preprocess(self,image):
        label_3 = np.zeros(image.shape)
        label = np.zeros(label_3.shape[0:2])

        if 3 == len(label_3.shape):
            label = label_3[:, :, 0]
        elif 2 == len(label_3.shape):
            label = label_3

        if 3 == len(image.shape) and 2 == len(label.shape):
            label = label[:, :, np.newaxis]
        elif 2 == len(image.shape) and 2 == len(label.shape):
            image = image[:, :, np.newaxis]
            label = label[:, :, np.newaxis]

        transform = transforms.Compose(
            [RescaleT(320), ToTensorLab(flag=0)]
        )
        sample = transform({"imidx": np.array([0]), "image": image, "label": label})

        return sample
    
    def process_single_image(self,image_path,output_path,custom_bg):
        image = io.imread(image_path)
        image = Image.fromarray(image).convert('RGB')
        image = self.preprocess(np.array(image))
        image = torch.FloatTensor(image["image"].unsqueeze(0).float())
        with torch.no_grad():
            d1, _, _, _, _, _, _ = self.net(image)
        pred = d1[:, 0, :, :]
        pred = self.normPRED(pred)
        self.save_output(image_path, pred,output_path,custom_bg)