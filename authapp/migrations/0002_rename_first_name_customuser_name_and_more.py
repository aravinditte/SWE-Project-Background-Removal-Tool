# Generated by Django 4.1.5 on 2024-04-21 11:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='first_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='last_name',
        ),
    ]