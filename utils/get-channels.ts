import { intro, outro, text } from "@clack/prompts";

type Channel = {
    name: string;
    description: string;
    private: boolean;
    id: string;
};

intro("Welcome to the channel finder!");
const token = await text({
    message: "Enter your API token",
    placeholder: "API token",
    validate: (input) => {
        if (input.length === 0) return `Value is required!`;
    }
});

const response = await fetch("https://slack.com/api/conversations.list", {
    headers: {
        Authorization: `Bearer ${token as string}`
    }
});

const data = await response.json();

if (!data.ok) {
    console.error(data.error);
    process.exit(1);
}

const channels: Channel[] = data.channels.map((channel: any) => ({
    name: channel.name,
    description: channel.purpose.value,
    private: channel.is_private,
    id: channel.id
}));

console.log("Channels:");
channels.forEach((channel) => console.log(channel));
// console.log(data)

outro("Goodbye!");