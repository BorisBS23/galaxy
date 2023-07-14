const express = require('express');
const { MessageEmbed, Client, Intents } = require('discord.js');
const path = require('path');

const app = express();
const PORT = 3000; // Change this to the desired port number

const discordToken = 'MTA5OTYwMjkwOTA1NTk1OTA3MQ.GydHxH.WCs0huttN1WWpAvvCifMk63UwvvuZR-zf4BEYc';
const channelId = '1127498284223709265';
const secondChannelId = '1129143073524424744';

const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
client.login(discordToken);

// Serve static files from the same folder as server.js
const staticPath = path.join(__dirname);
app.use(express.static(staticPath));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', (req, res) => {
  const { firstName, lastName, email, discord, message } = req.body;

  // Validate field values
  console.log('Validating form data...');
  console.log('First Name:', firstName);
  console.log('Last Name:', lastName);
  console.log('Email:', email);
  console.log('Discord:', discord);
  console.log('Message:', message);

  if (
    !firstName || firstName.trim() === '' ||
    !lastName || lastName.trim() === '' ||
    !email || email.trim() === '' ||
    !discord || discord.trim() === '' ||
    !message || message.trim() === ''
  ) {
    console.error('Invalid form data. Please fill in all fields.');
    return res.status(400).json({ error: 'Моля отговорете на всички въпроси!' });
  }

  const embed = new MessageEmbed()
    .setTitle('New Form Submission')
    .addFields(
      { name: 'First Name:', value: firstName },
      { name: 'Last Name:', value: lastName },
      { name: 'Email:', value: email },
      { name: 'Discord:', value: discord },
      { name: 'Message:', value: message }
    );

  const channel = client.channels.cache.get(channelId);
  if (channel && channel.isText()) {
    channel.send({ embeds: [embed] })
      .then(() => {
        console.log('Form submitted successfully to the first channel.');
        res.status(200).json({ message: 'Form submitted successfully.' });
      })
      .catch((error) => {
        console.error('Error sending message to the first channel:', error);
        res.status(500).json({ error: 'Възникна проблем. Моля опитайте по-късно.' });
      });
  } else {
    console.error('Invalid first channel or channel is not a text channel.');
    res.status(500).json({ error: 'Възникна проблем. Моля опитайте по-късно.' });
  }

  const secondEmbed = new MessageEmbed()
    .setTitle('New Form Submission')
    .addFields(
      { name: 'First Name:', value: firstName },
      { name: 'Last Name:', value: lastName },
      { name: 'Email:', value: email },
      { name: 'Discord:', value: discord },
      { name: 'Message:', value: message }
    );

  const secondChannel = client.channels.cache.get(secondChannelId);
  if (secondChannel && secondChannel.isText()) {
    secondChannel.send({ embeds: [secondEmbed] })
      .then(() => {
        console.log('Form submitted successfully to the second channel.');
      })
      .catch((error) => {
        console.error('Error sending message to the second channel:', error);
      });
  } else {
    console.error('Invalid second channel or channel is not a text channel.');
  }
});

client.on('ready', () => {
  console.log(`Discord bot is logged in as ${client.user.tag}`);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Additional error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Error handler middleware
app.use((error, req, res, next) => {
  console.error('Unhandled Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Not Found middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
