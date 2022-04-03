# Welcome to Influ.ai Front End Contributing Guide!
Thank you for investing your time in contributing to our project!

This file describes the contribution guidelines, but it is still incomplete and we welcome new changes to it!

## Content
* [State Management](#state-management)

## State Management

We write React components as [functional components](https://reactjs.org/docs/components-and-props.html), which we define as [observers](https://mobx.js.org/react-integration.html). The local state is handled by [React hooks](https://reactjs.org/docs/hooks-intro.html).

This is typically how a component looks like:

```typescript
const InfluencerProfilePage = observer((props: Props) => {
	const { influencerStore, user } = store
	const { currentInfluencer, fetchInfluencerById } = influencerStore
	const { influencer_id } = useParams()
	const { i18n: {t} } = useTranslation()
	const history = useHistory()
	
	const [open, setOpen] = useState(false)
	
	...
}
```

For the global state, we define class objects and the field variables as [@observables](https://mobx.js.org/observable-state.html#observable), in case they represent some state.

An example of such a class object can be seen here:

```typescript
export class MarketPlaceStore {
  filterStore = new FilterStore()
	
	@observable isFetching = false // is loading data
	@observable loadingInfluencers = false // only when filtering influencers
	@observable isFiltering = false
	@observable influencers: InfluencerProfile[] = []
	@observable filteredInfluencers: InfluencerProfile[] = []
	@observable currentPage = 1
	@observable influencersCount;
	@observable sortOpt: SortType = 'followers'
	
	@action
	init = () => this.clearSearch()
	....
}
```

Methods that happen to change state variables ([@observables](https://mobx.js.org/observable-state.html#observable)) are annotated with [@action](https://mobx.js.org/actions.html).
