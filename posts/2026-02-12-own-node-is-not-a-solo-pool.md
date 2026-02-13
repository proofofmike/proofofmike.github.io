# Maybe I’m Old-School, But This Still Bothers Me

The other night I wrote about appliance nodes and “sovereignty.” It was late. It was blunt.

I’ve had time to think about it.

It still bothers me, but now for a more technical reason.

---

## The question I keep seeing

I watched someone who’s been mining for about a day ask what solo pool is best. And honestly, there isn’t a universal answer. The real answer is: pick the pool that has the features you need, the operator you trust, and the reliability that works best for you personally.

If someone’s new, tell them that, then point them at a couple time-tested options and get them headed down the rabbit hole. That’s helpful.

What’s not helpful is what I saw next. The dominant reply was:

“Run your own node.”

---

## A node is not a mining setup

Here’s what gets skipped.

A Bitcoin node validates blocks and transactions. It enforces consensus rules and maintains a mempool. It does not magically become “a mining setup” because you plugged it in.

If you want to actually mine against your own infrastructure, you’re dealing with a stack:

- block template construction and policy (via your node’s RPC)
- work distribution (stratum or equivalent)
- share submission plumbing
- extranonce and coinbase handling
- updates and maintenance
- and the part nobody talks about: monitoring, alerting, and failure modes

Now, to be fair, some appliance nodes bundle pieces of this stack. They might ship with stratum or a proxy built in. But bundling it doesn’t remove the responsibility. It just abstracts it.

If you don’t understand what’s running, how it’s configured, and how you’d detect when it’s wrong, you’re not “sovereign.”

You’re not even responsible. I’d argue you’re irresponsible. You’re taking on infrastructure risk you can’t see, can’t measure, and can’t troubleshoot.

---

## Slogans are not understanding

What really bugs me is how often this advice is just people repeating something they’ve heard. A slogan. A vibe. Not an understanding.

History teaches us when a crowd starts repeating things they don’t understand, usually nothing good comes from it.

---

## Why time-tested solo pools exist

There’s nothing wrong with trusted, time-tested solo pools while you learn. That’s literally one of the reasons why they exist. Those operators focus on uptime, peers, security posture, and resilience so you can learn the fundamentals without cosplaying as “fully sovereign” on day one.

If you want to go fully in-house, I respect it. But do it deliberately.

Build it from source or via trusted package management. Build and inspect your configs. Run a node in a test environment (testnet, signet, or regtest). Break things. Watch how templates change. Kill processes and see what fails.

Then start introducing the other parts of the stack, one at a time. Test end-to-end. Confirm the whole flow works. Set up monitoring. Learn the failure modes. The list goes on.

“Run your own node” without explaining the rest of the stack isn’t helpful. It’s a slogan.

Full stacks are great, but you don’t tell someone asking where the best place to go bass fishing is to build a boat.

---

*Posted: 2026-02-12*
