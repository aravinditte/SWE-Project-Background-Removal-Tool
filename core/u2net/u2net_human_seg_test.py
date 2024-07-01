import os
from skimage import io
import torch

from torchvision import transforms
import time
import numpy as np
from PIL import Image
import glob

from data_loader import RescaleT
from data_loader import ToTensorLab
from model import U2NET 


def normPRED(d):
    ma = torch.max(d)
    mi = torch.min(d)

    dn = (d-mi)/(ma-mi)

    return dn

def save_output(image_name,pred):
    predict = pred
    predict = predict.squeeze()
    predict_np = predict.cpu().data.numpy()
    im = Image.fromarray(predict_np*255).convert('RGB')
    image = io.imread(image_name)
    imo = im.resize((image.shape[1],image.shape[0]),resample=Image.BILINEAR)
    return imo
    # pb_np = np.array(imo)
    # aaa = img_name.split(".")
    # bbb = aaa[0:-1]
    # imidx = bbb[0]
    # for i in range(1,len(bbb)):
    #     imidx = imidx + "." + bbb[i]

    # imo.save(d_dir+imidx+'.png')
   
def naive_cutout(img, mask):
    empty = Image.new("RGBA", img.size, (255, 255, 255, 255))
    resized_mask = mask.resize(img.size, Image.LANCZOS)
    cutout = Image.composite(img,empty, mask.resize(img.size, Image.LANCZOS))
    return cutout

def preprocess(image):
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

def process_single_image(image_path, prediction_dir,net):
    image = io.imread(image_path)
    image = Image.fromarray(image).convert('RGB')
    image = preprocess(np.array(image))
    image = torch.FloatTensor(image["image"].unsqueeze(0).float())
    with torch.no_grad():
        d1, _, _, _, _, _, _ = net(image)
    pred = d1[:, 0, :, :]
    pred = normPRED(pred)
    save_output(image_path, pred, prediction_dir)
 

def main():   
    start_time = time.time()
    model_dir = os.path.join(os.getcwd(),'saved_models','u2net.pth')
    net = U2NET(3, 1)
  
    if torch.cuda.is_available():
        net.load_state_dict(torch.load(model_dir))
        net.cuda()
    else:
        net.load_state_dict(torch.load(model_dir, map_location='cpu'))
    
    net.eval()
    
    image_dir = os.path.join(os.getcwd(), 'test_data', 'new_folder')
    prediction_dir = os.path.join(os.getcwd(), 'test_data', 'test_human_images' + '_results' + os.sep)
    img_name_list = glob.glob(image_dir + os.sep + '*')
    
    process_single_image(image,prediction_dir,net)    
       
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Time taken for Entire Process: {elapsed_time} seconds")

if __name__ == "__main__":
    main()
