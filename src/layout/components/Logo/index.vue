<template>
    <router-link v-slot="{ navigate }" custom :to="to" :class="{
        'title': true,
        'is-link': $store.state.settings.enableDashboard
    }" :title="title" tag="div"
    >
        <div @click="navigate">
            <h2>{{ $title }}</h2>
            <img v-if="showLogo" :src="logo" class="logo">
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'Logo',
    props: {
        showLogo: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        const _this = this
        return {
            title: _this.$title,
            logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAAAsCAYAAACDpZHMAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAEjJJREFUeJztm3m4XVV5xn/f2me6mQMJIRMEwhAZZRTRQmRQpoglWkWrpdqKE4+idaC1oj5OfbRqoWoVLSDQOIBVaJWqgIwKKCqIEyIQBgkJIRO5ueeevb7+8a5z9z7nnntzUmn/6XmfZz/nZu+1117Du95vWCswwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwDME66fQ7h+/CqDi1WzF8E6Ny5v1rGFE8BzziHu8LHg8GxgZq/jRDdiq+8ZXFr1h0d+E2Ws9C4s8s995CBd5Fr5OCE9h+FgdWUZYunt3DXPd7GIP2UmemWGpC+5rLPp73OwyKOpo48nPvRSznt09GtgPuAZ4ChgFrgJ+Bny4NEYfAZ4NnA080FWH0XssIxDSZaUrA+YChwDHpe++v9Tudpks/T0TOAI4BbgDuKRUVwT2BM4H5gF/BTzSoy0V4BzgFcB5wI1A3lXmsPTsLuALwLqxDvYeu54f2T6iA+xqrXh2devoUKsWcOsYwDOBzwM/LG6Nm1OA2ZhdTGAFTih14gBgf+BjwB/GXnanumlz8XYImdeqKz2rHJJnnrkHPAu4GRbjXLBXA9fTe0B7YQqwEng1MB04CngHmpj5wMuAhcBXgd3QePXq2E7AocBQ6d4m4Fbg+enZLsCCVM9SYOdUVxPYCPxL6jvAHDTxJwN7AEuAKrAN2B24HFiWnl0P1FI7F6VyZRhQT21bChyZ+jYNGO4qPw8tms3ArPSc1M6tPfo9Dv0RyqlgnIz7iZWRnOq2Fs1GKJeogX/EPa4I+Ba948RqqXr3KZbH92Gc5phZjE6xquvA64DVhn0e2Iz1XBX7WB5PN1oLzAMxZER33CwCFQ92GGavxfh4aTAmQg1N2IuA64A1wAmIWKCB3iddN6IBbqLJnYoG+Vfpd3/gi2hCmmjy7gVeADwLeBvQQmoyC03mHen6HXA38GRX+3YB9gYaSOEeAr4C3I4I93HgQOBC4LZUphdmpn4eABye7r0k9etb6e82lgCzgYOBNwFb0v37gUsnqL8DfRLKd8fsXCBYK1LdlnteNc+zDpVaDrwc+FfGr2IDTvIQXoVkHMyiRTcvqphixhss2E8shJuA3IJhMY49d1iB+1F4hgUnyxzz4DFkxCyQBmMFIsBNPdpR7vehwOsRsS6hkP/56d5UNBkgouyEVOHSUtl9EFHa+DkyF6eU7l1JscIfBV4JnAZ8CvgGUuhlwMPA6vTOU6lN30Zm8V2ISB9O9TQoVPPc9H57IXRjGnA8cFKpPy9A5FkF/GWpbB2Ykfq1a+qnI3PcF/pVqDeilaaXmjnVZiBvdCqIyVxcDy4fI+i5OwvNOBtNSrpnlmxpqRJbijp4D7AOBxsZATC3cLBl2emehVm4QwjgAatUnBDKq/MAtCLvQtLdC7OAM5Dv9AWkEMvSs3PQRM1M9+5FpmTnVG46UqQfMJ6wd6IFdRAiJMAGYDFSzG8DL+wcMl6L/J4zKQhVTVdM9WTp+0cgst2NCLU+vds2ab2wIZX9MTLvJwBfT9dq4IOlsvsi8/8b4GpkivP0fl/oj1CS2DFYxKojubeqWbdK7WX4X7v734PnnmUAGe5nuPuzaatTqgYzJ0an7I+ZnY7xLcO+geF5K8fMZlngJPBDzTMIjmcO4FTH2cWABrfblygjB9aiFfog8pUeQ8o2DSlNG79GhKggH+9QYC/gvYx3anvBgD9F/s81Xc/mAc9F/tZNpfu7Iuf/SLQI56Tvfgz4JjJBR6LA4VzkV/0tIn43tgDfQwtgX0So76fvtYCLSmVfALwYEeoKCp+ub/RLqAuQbI41uDLqVEedGDqWacXhDMOvAn5iwcDZB2OFY3PG1RqAHNw7hGqGYe+wYDcDT8TRVsBsv5BlZ1iwhgWHLGCeQbXqjhXqpCruRz7RU5P0ZxNaobOQIq5E6rqqx5iMIEJUkOLVU8v7dfybSJlejpz+Mo5G5LmBUkSFhrSFIs6pFGrVREQ4BXg3cC0ixKN9tqUXZiETDFLsGWjBrETq9jRaCK2eb3ehP0IFuwc5nefTnjbHaiPurSoewxgbDGc3k4z/KoQQ3f3FYIdYb6fRMJxWdO8Mu48Ee50ZH201R2dalq3EWWZZwNx11TL3EDrUyWELxneBW5jYfwIpy0NoxS4H7kOT9eeM90WaKJraGSnFgvT+OvqDA/8BvAZN2LbSs10QUbpNyho03v8FvBNFcJuQA34nUtGAfMBZSHH6i+uF+cgZ/1Zqw4fS/QZSxMMRqXJE1mt5RglltICvAaciOw5AlrvVmhZb9Y7ONHBOsEZ2HAvrT/JY8zRKvtM4hAC08FiafyMz4y2YXR1b+TxzXuGZV4I7FoxQwalWILTNnQE4zr04lyLfYgzff8tRvSLGpchf2Be4DK3GDXQOnCFzNxMRYRnyJdfQSYzJcHD6vRip2uFo3JeifNZFiCxLkbqC/K3fIFM2H5FnASLlb5BKvRep1Imp3u0RqobUFeCNiCzXogWzCPg9nQHVAqTMU/rsJ9C/QjnwAGYXoVC1Afp0pYll3SqFL6Fib7aplTWWtQ6l3FmjWzvMqbi38i4HnQUGH7A8Zu7Mx50YHMsM6jVClpy34o31wCrc7+lu/t5L5nbfmoVM0GlokNsr8ZcUzjTI3N2BVGQ58j/2piPftl18GiUx2zmsOUgFz0FEMuTDvZ2CUKAJXYkmu5Xadyya9PMozPpiRPATJ/j+EHAMii6PT/emIad7FCntL1I7vgP8NpU5K/3+gP58RaBvhTLQ4N4AfBc5bnoUsWrT4kijgww1GpXlNqfWYnVzCrF4EJ5Tz/2eZvCtPlbeQjAHj3lXu81OzSqZ56Mt2oQKoeJWr2Elc+ea8HvM/XK6pPnmdx7D1KFad4889X0dRcKugnJhZfatA/6ZIlXwN4iMd0wyWt14jELNqhSh+TpEBIDHUS6pjSkoCj0VRavLUOT7GeAfUj0jyPzdhUzyRCZ+DjLlp1Mo1EfRbkAz9evfUGpieapzHkrIDiFfc7TfzvZr8kgNfhCzK4DnIZ8CgKxlIeQhxhALP6liDZvXcBaOuj06qhoWZjHsVs/cLPodzU6JrlYAd7zTfGZDdfdtTZnEzAn1KVilaHYaxaeBTwJP4p3jOnvGEF2uFkgZvoRyP29O9wIyzY8g/2U3tEoDipR+jkziQuSz9IuzKXR0NlKiVwH/iFQCtCCeLrXjWGTOfomy7UsQgS5NdR1NkaQEkWYPRNRzKPJYD6f3rkNJ0ZegNMPaVKbt/F+F/N7TkSIdjgh1NVKsyfzRDvQb5bXRAn6EopZXlx9koxmx3uW3zaqaza+5rc21DpY1IEBYWLG4cx7Z4GMEzLJguMe8lUN7AgysUrFsqOb50yNmtYqHeg2kaGXm3cb4kHwyOCLO/VDWT0C+xGeQr3gWMj0HpfLr0m+PTcoJsaX0dwWpgiM/qVeeLKLR2oqc5sdKz5oos/6pSb53LiLBh9O/n0DkqiKT3QuPpjovRAutnQf7EuMz+JOiL0JZ1hGgrUZRy3Jkv1UmhmB5FimrlAG71uGJ3GngzMgCFiHDwrMqHu/MO6Yz1KoW3SmrjAUjTGkQh5seGnVCrarlUrBpxPD3Wbe53HG0c2TN0r1pyBFejJKJi5BCHUxvlWpvBP+xuB9F1DfTqUQgR/6Crnuz0XxMQyS8gvELZTKMoFzVNcjU5si0/oIdUCfYcYVq4wZThHAWpQSi5VXz0OoQD5+eGYur0WYYVIqgzHYybEEY9seKDK+FYJl7jM3R5G9rQ92qVbKdZrjVa9YO15KEucHF+A75NBNhF0SqjaV7NUSwTcifqSBT8V6Ued7QVcdilGuaxXi/w9L7/Yz579PljCfUvcBbu+7ti5R0Ecp8l09DGCJ5rce3LbV1DsptHUwRKJyQ2nATUubJ8npj2BEfqvRPW4vxDTR4B4yV8GAeqxHLO99YVDOIhpcWTYX1Ns9u8DV2PKW0goW6WXQnz8fMHiFYmDJkno1b/A/hfCjzyRZjXwvM0ApvUJizEWRKv4lM3n4oUz0dJUHfRrHHNYwGf+90keppy2YVbdcckK5RJo+cdkgVtoMh1P69kHMfkeviyEk/H20HLUJkvSS9czIyg48ji/T2fj7WF6Gy8RMJcJMb30PO4LT2TfequY26USKVlU85AZCD3eiB8z2EYbBi0xjMhurRt27Tm0UdmHVUMwL+adzLPkYH3nz0Qhr1yXZgiBST20BbDdenZw8hJdhMcV7q39O/j0KK0MZ9aOujXrq3hSKCnIqiqJchxbuVTt9oMrQd5+2ZsJzeycddkIP/klTH71A/I4omX4N8rotQtPdTpGhXAy9FAcCZPJOEcut5e2tqwDFon0ms82C51z0w2p1XKmMtxgVWtd8SwpWYHY1WEACW1QIxRkZGyxvH3XX8COdK68iIduLPXrg/s2dOnegxaFK/jhztm5EZa+/jbUR7ZQH4HFKhB9FEnI8ipTY2MHluqu2jrEXjdiNSg37wABrnh5g4W/0UIvxMZLLK2Jy+vQ4tnh9SRG4jwCdQFHgXhZmO6HTDj5G6HU+f6Ctdv8dnJwygsmiclwd7VyuE6a1g5MGIwb1qT1PxbYZHLF14xMgx988Y8a2+yfL89soumP2dK7wuVrhHt81bMdwIAbIMsoCHDM/CRkJ4o5m1cynjcN6L9uSVKw5j59nTej3+/4b2iVFnx5z1MTyjJzbjxJXlblyBziAdQXsPxILl1D1j1I3Y/fLDwAVOyB2DENZi/KeZLUerISEYUxqRrcO9Pv5d8Fvce5MJ4KiDF09GpiG0KbsxXYZMxp6IoIchX6mFTMRaChOxGqnMsWgVH4JW/QzkC66lyCmBTkAe2NX/0fQtkErehMzic9M32yo5BYX001DCdSSV+yVSo7bfsyC1I6C0zjpklu+kMJcZ8u/2R6r1o/SboZMLi1Jff422gdantk1Hc9t2BSZFXyFutIkvhwfBPktHVGPkoUZudbpE0IFPOXafF8ewHex2LFxLCJsJgbGrUTdq1c5Up42dXHx8ovZ+YMXe7LX7vO31e1+KU4wnokk7Ay2yU5GfsQZN4oFoIo5CxAH5FVPRfhcoUjoQRU1lbEakPRT5VaPoAFs1feOpVOe5iOizUYLxeal9dZS5PiK14YMUG9V/gib/RYh8NZS4nJ760nYgLfXzeESwucBfpPIr0ULeihbS8vT8OLTozmLyo0AdeCZyJu5yVq8t34wEa4U60SplH+cWsMtJUYybEasVYqWyMWbhazFkv4gh0wnMkBGzisUpQ2CWDj/Rwv2b5vEWy+Oo5Tm9rj0Wzmb2rEl9p+HU90VooM9Eg7g/UoSZaIU+gSZ8KpqwRWiSD0KZ9IzirFg1letW/QdQtLgeKdl9qewwhQqcjNThunT9BE32kvStAxCJpiAf6e0UJ0r3Tn1xRNhhRPy5FKt5VqprbXrvkdSXJWjxfBsp0M1IgX+Wyr2DQvX6Ql8mb7R3lFfGJjfOQ6tofvtmK9Qs84YHb2LOeuBDTljX7qZbwIvDlne7hcvc2BOtSADM6tDIPYw0zeCHDl/FWfdHRtYREeVACnP3fDTQTbTCD0fqUnae2/8ZYQPtDfL+vtUq/ZLqX5x+b0ek+BpFDmwjIsFBqR1zKLLqtyEivzK1o4ZU7zhEtrspzUHCEGOnz3gp2o/dkuqtIWK/HHgOMsmXoQTpeegITbejPyH6Uii37V/I9r6+/HHHaFWG8FDbiqT6VkpMcDPyLGtfozELX/YQvhKzbDhmGTHLiJWK5UND5ln4LdoS+TH/Q8eyCw8jlQHtZb0e+RwgZVqFQufVpXceQQO9KvWz7Zu0/0fLNPob/DVoolah/+jwPeANSLnmIMU8BI3plegUQNsvG07tmpvavxWR74so9D8GkbSM9vbJTii9cSvy4X6d6tsfRYm3IRPfVudN6fpf28ubDBGZvVOA96AVX41W/WkMtQuCbfuOeYezCohUJTyN2Xvc7KeYnQ0c4rDNqV4X6vULs5GRW9jOUYpPnHkQxz9/v37a+wfkDK9Pv6dSSPt0NDlNtFn6OFKXJ5AqbEZE24COk3wyPfsy47PnoLFZV2r7ApSTGkaK8k9Ilb+KlOMaZH52RhO6HpFiMzq58DjadzsxtX0IeAvyty5F5nMdSlJGlBJYhY7rnI9IeGFq67vRfC1KbbkEkddSn/o6WDfAAAMMMMAAAwwwwAADDDDAAAMMMMAA/5f4b8D835CYp0o7AAAAAElFTkSuQmCC'
        }
    },
    computed: {
        to() {
            let rtn = {}
            if (this.$store.state.settings.enableDashboard) {
                rtn.name = 'home'
            }
            return rtn
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    position: fixed;
    z-index: 1000;
    top: 0;
    width: inherit;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $g-sidebar-logo-height;
    text-align: center;
    overflow: hidden;
    text-decoration: none;
    &.is-link {
        cursor: pointer;
    }
    .logo {
        width: 80% !important;
        height: auto !important;
        display: none;
        & + span {
            margin-left: 10px;
        }
    }
    span {
        display: block;
        font-weight: bold;
        color: #fff;
        @include text-overflow;
    }
}
</style>
