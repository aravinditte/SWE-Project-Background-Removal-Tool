from django.shortcuts import render
from .u2net.worker import Process
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import requests 
import time
p = Process()
import cv2
import tempfile
import shutil

@csrf_exempt
def process_video(request):
    if request.method == 'POST':
        video_file = request.FILES['video_file']
        bg_url = request.POST.get('background_image')

        video_file_name = video_file.name
        video_file_path = os.path.join('media', video_file_name)
        with open(video_file_path, 'wb') as f:
            for chunk in video_file.chunks():
                f.write(chunk)

        bg_response = requests.get(bg_url)
        if bg_response.status_code == 200:
            bg_file_name = 'background_image.jpg'
            bg_file_path = os.path.join('media', bg_file_name)
            with open(bg_file_path, 'wb') as f:
                f.write(bg_response.content)
        else:
            return JsonResponse({'error': 'Failed to download background image'})

        temp_dir = tempfile.mkdtemp()

        cap = cv2.VideoCapture(video_file_path)
        frame_count = 0
        frames = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            frame_filename = f'frame_{frame_count}.jpg'
            frame_path = os.path.join(temp_dir, frame_filename)
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)

        cap.release()

        processed_frames = []
        for frame_path in frames:
            output_filename = 'remover_' + os.path.basename(frame_path)
            output_path = os.path.join(temp_dir, output_filename)

            p.process_single_image(frame_path, output_path, bg_file_path)
            processed_frames.append(output_path)

        processed_video_path = os.path.join('media', 'processed_video.mp4')
        frame = cv2.imread(processed_frames[0])
        height, width, _ = frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(processed_video_path, fourcc, 30.0, (width, height))

        for processed_frame_path in processed_frames:
            frame = cv2.imread(processed_frame_path)
            out.write(frame)

        out.release()

        shutil.rmtree(temp_dir)

        processed_video_url = '/media/processed_video.mp4'

        return JsonResponse({'message': 'Video processed successfully', 'processed_video_url': processed_video_url})

    return JsonResponse({'message': 'Only POST method is allowed'})


@csrf_exempt
def process_file(request):
    if request.method == 'POST':
        original_image_file = request.FILES['original_image']
        bg_url = request.POST.get('background_image') 

        original_file_name = original_image_file.name

        original_file_path = os.path.join('media', original_file_name)
        with open(original_file_path, 'wb') as f:
            for chunk in original_image_file.chunks():
                f.write(chunk)

        bg_response = requests.get(bg_url)
        if bg_response.status_code == 200:
            bg_file_name = 'background_image.jpg' 
            bg_file_path = os.path.join('media', bg_file_name)
            with open(bg_file_path, 'wb') as f:
                f.write(bg_response.content)
        else:
            return JsonResponse({'error': 'Failed to download background image'})

        output_filename = 'remover_' + original_file_name

        p.process_single_image(
            'media/' + original_file_name,
            'media/' + output_filename,
            'media/' + bg_file_name
        )

        processed_image_url = '/media/' + output_filename

        return JsonResponse({'message': 'File uploaded successfully', 'file_path': processed_image_url})

    return JsonResponse({'message': 'Only POST method is allowed'})
