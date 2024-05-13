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

let channels: Channel[] = [];
let cursor: string | undefined = undefined;

do {
    const response: Response = await fetch(`https://slack.com/api/conversations.list?types=private_channel&${cursor === undefined ? "" : "cursor=" + cursor}`, {
        headers: {
            Authorization: `Bearer ${token as string}`
        }
    });

    const data = await response.json();

    if (!data.ok) {
        console.error(data.error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue
    }

    channels.push(...data.channels.map((channel: any) => ({
        name: channel.name,
        description: channel.purpose.value,
        private: channel.is_private,
        id: channel.id
    })));

    cursor = data.response_metadata.next_cursor;
    console.log(channels)
    console.log(`Fetched ${channels.length} channels...`);
    await new Promise((resolve) => setTimeout(resolve, 200));
} while (cursor);

console.log("Channels:");
channels.forEach((channel) => console.log(channel));

Bun.write("output/private-channels.json", JSON.stringify(channels, null, 2));

outro("Goodbye!");